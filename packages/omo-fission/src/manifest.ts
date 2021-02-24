import {FissionDrive} from "./fissionDrive";
import {RuntimeDapp} from "omo-kernel-interfaces/dist/runtimeDapp";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import {tryToAuthenticate} from "./tryToAuthenticate";
import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";
import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
import {State} from "omo-webnative/dist";
import {BehaviorSubject} from "rxjs";
import {Client} from "omo-central-client/dist/omoCentralClient";

export interface FissionAuthState {
  fissionState: {
    fissionState: State,
    username: string,
    fission: FissionDrive,
    throughLobby: boolean,
    newUser: boolean,
    omoCentralClientSubject: BehaviorSubject<Client | undefined>
  },
  fission: OmoBehaviorSubject<StatePropagation<FissionDrive>>,
  username: string
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
  const authResult = await tryToAuthenticate();

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
