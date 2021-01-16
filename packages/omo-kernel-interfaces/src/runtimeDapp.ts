import {DappManifest} from "./dappManifest";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {Topic} from "omo-utils/dist/eventBroker";
import {StatePropagation} from "./statePropagation";
import {BehaviorSubject} from "rxjs";
import {DappState} from "./dappState";
import {Signal} from "omo-events/dist/signal";

export interface RuntimeDapp<TInternalState extends DappState, TExternalState extends DappState> extends DappManifest<TInternalState, TExternalState>
{
  runtimeId:string,
  route: string,

  // shell: Shell,

  /**
   * Used by the dapp to receive incoming events.
   */
  inEvents?:Topic<OmoEvent>,
  /**
   * Used by the dapp to send outgoing events for other dapps to subscribe.
   */
  outEvents?:Topic<OmoEvent>,


  state: () => BehaviorSubject<StatePropagation<TExternalState extends DappState>>

  emitSignal: (signal:Signal) => void;
  emitState: (state:DappState) => void;
}
