import {DappManifest} from "./dappManifest";
import {RuntimePageManifest} from "./runtimePageManifest";
import {OmoEvent} from "../../o-events/omoEvent";
import {Topic} from "../eventBroker";
import {Shell} from "./shell";

export interface RuntimeDapp<TInternalState, TExternalState> extends DappManifest<TInternalState, TExternalState>
{
  route: string,

  runtimePages: RuntimePageManifest[],

  shell: Shell,

  /**
   * Used by the dapp to receive incoming events.
   */
  inEvents?:Topic<OmoEvent>,
  /**
   * Used by the dapp to send outgoing events for other dapps to subscribe.
   */
  outEvents?:Topic<OmoEvent>,

  /**
   * Holds the full state of the running dapp.
   */
  state: TInternalState,

  /**
   * A filter function that filters and/or transforms the internal state
   * for external consumption.
   * E.g. the Dapp can publish a StateChanged-event to prompt
   * other Dapps to update their values accordingly.
   */
  getExternalState: () => TExternalState

}
