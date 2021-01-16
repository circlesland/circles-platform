import {DappManifest} from "./dappManifest";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {Topic} from "omo-utils/dist/eventBroker";
import {StatePropagation} from "./statePropagation";
import {BehaviorSubject} from "rxjs";

export interface RuntimeDapp<TInternalState, TExternalState> extends DappManifest<TInternalState, TExternalState>
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


  state: () => BehaviorSubject<StatePropagation<TExternalState>>
}
