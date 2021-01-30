import {DappManifest} from "./dappManifest";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {Topic} from "omo-utils/dist/eventBroker";
import {StatePropagation} from "./statePropagation";
import {DappState} from "./dappState";
import {Signal} from "omo-events/dist/signals/signal";
import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";

export interface RuntimeDapp<TState extends DappState> extends DappManifest<TState>
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


  state: OmoBehaviorSubject<StatePropagation<TState>>

  emitSignal: (signal:Signal) => void;
  emitState: (state:TState) => void;
}
