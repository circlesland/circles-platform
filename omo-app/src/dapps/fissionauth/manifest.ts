import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Auth from "./pages/Auth.svelte";
import Authenticate from "./pages/Authenticate.svelte";
import { DappManifest } from "../../libs/o-os/interfaces/dappManifest";
import { omoSapienDefaultActions, omoSapienOverflowActions } from "../omosapien/data/actions";
import { FissionDrive } from "../../libs/o-fission/fissionDrive";
import { tryGetDappState } from "../../libs/o-os/loader";
import {BehaviorSubject} from "rxjs";
import {RuntimeDapp} from "../../libs/o-os/interfaces/runtimeDapp";
import {Signal} from "../../libs/o-circles-protocol/interfaces/blockchainEvent";
import {Envelope} from "../../libs/o-os/interfaces/envelope";

export interface FissionAuthState {
  fissionState: any,
  fission: BehaviorSubject<Envelope<FissionDrive>>,
  username: string
}

let fissionAuthLogger;

/**
 * Checks if the user is authenticated and redirects him to the 'Authentication' page if not.
 * If the user is already authenticated, he is presented with the default page of this dapp.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack, runtimeDapp:RuntimeDapp<any, any>)
{
  fissionAuthLogger = window.o.logger.newLogger(runtimeDapp.id);
  const initLogger = fissionAuthLogger.newLogger(`initialize(stack:[${stack.length}], runtimeDapp:${runtimeDapp.id})`)
  initLogger.log("begin");

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (fissionAuthState?.fissionState) {
    initLogger.log("end");
    return {
      cancelDependencyLoading: false,
      initialPage: authPage
    };
  }
  else
  {
    initLogger.log("Cancel dependency loading. The user is not authenticated.")
    if (stack.length == 0) {
      initLogger.log("Redirecting to runtime dapp route (after authentication): '" + runtimeDapp.route + "'")
      window.o.redirectTo = runtimeDapp.route;
    }
    else
    {
      initLogger.log("Redirecting to last route from stack (after authentication): '" + stack[0].route + "'")
      window.o.redirectTo = stack[0].route;
    }

    initLogger.log("end");
    return {
      cancelDependencyLoading: true,
      initialPage: authenticate
    }
  }

}

const authenticate = {
  routeParts: ["authenticate", ":redirectTo?"],
  component: Authenticate,
  userData: {
    actions: [
      ...omoSapienDefaultActions,
      ...omoSapienOverflowActions
    ]
  }
};

const authPage = {
  isDefault: true,
  routeParts: ["auth"],
  component: Auth,
  available: []
};

export const fissionauth: DappManifest<FissionAuthState, FissionAuthState> = {
  id: "omo.fission.auth:1",
  dependencies: [],
  isHidden: true,
  isEnabled: false,
  icon: faCheckCircle,
  title: "Fission Auth",
  routeParts: ["fissionauth"],
  tag: Promise.resolve("beta"),
  initialize: initialize,
  pages: [
    authenticate,
    authPage
  ]
};
