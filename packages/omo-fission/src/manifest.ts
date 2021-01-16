import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {BehaviorSubject} from "rxjs";
import {Envelope} from "omo-kernel-interfaces/dist/envelope";
import {FissionDrive} from "./fissionDrive";
import {RuntimeDapp} from "omo-kernel-interfaces/dist/runtimeDapp";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import {tryToAuthenticate} from "./tryToAuthenticate";

export interface FissionAuthState {
  fissionState: any,
  fission: BehaviorSubject<Envelope<FissionDrive>>,
  username: string
}

/**
 * Checks if the user is authenticated and redirects him to the 'Authentication' page if not.
 * If the user is already authenticated, he is presented with the default page of this dapp.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack:RuntimeDapp<any, any>[], runtimeDapp:RuntimeDapp<any, any>)
{
  const authResult = await tryToAuthenticate();

  return {
    initialPage: <any>{},
    cancelDependencyLoading: false,
  }
}

export const fission: DappManifest<FissionAuthState, FissionAuthState> = {
  id: "omo.fission:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  isEnabled: false,
  icon: faCheckCircle,
  title: "Fission",
  routeParts: ["fission"],
  tag: Promise.resolve("beta"),
  initialize: initialize,
  pages: []
};
