import {RuntimeDapp} from "omo-kernel-interfaces/dist/runtimeDapp";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import {AuthSucceeded, Continuation} from "omo-webnative/dist";
import {OmoCentral} from "omo-central/dist/omoCentral";
import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";
import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
import {FissionDrive} from "./fissionDrive";

export interface FissionAuthState {
  state:Continuation|AuthSucceeded;
  fission: OmoBehaviorSubject<StatePropagation<FissionDrive>>,
}

/**
 * Checks if the user is authenticated and redirects him to the 'Authentication' page if not.
 * If the user is already authenticated, he is presented with the default page of this dapp.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack:RuntimeDapp<any>[], runtimeDapp:RuntimeDapp<any>)
{
  // TODO: Implement as "kernel module" (singleton) and provide
  //       the actual fission APIs via the state of this "dapp"
  const state = await OmoCentral.instance.subscribeToResult();
  const authResult = state.fissionAuthState;

  return {
    initialPage: <any>{},
    cancelDependencyLoading: false,
  }
}

export const fission: DappManifest<FissionAuthState> = {
  dappId: "omo.fission:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  isEnabled: false,
  icon: undefined,
  title: "Fission",
  routeParts: ["fission"],
  tag: Promise.resolve("beta"),
  initialize: initialize,
  pages: []
};
