import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Auth from "./pages/Auth.svelte";
import Authenticate from "./pages/Authenticate.svelte";
import { DappManifest } from "../../libs/o-os/interfaces/dappManifest";
import { omoSapienDefaultActions, omoSapienOverflowActions } from "../omosapien/data/actions";
import { FissionDrive } from "../../libs/o-fission/fissionDrive";
import { tryGetDappState } from "../../libs/o-os/loader";

export interface FissionAuthState {
  fission: FissionDrive,
  username: string
}

/**
 * Checks if the user is authenticated and redirects him to the 'Authentication' page if not.
 * If the user is already authenticated, he is presented with the default page of this dapp.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack, runtimeDapp)
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (fissionAuthState?.fission) {
    return {
      cancelDependencyLoading: false,
      initialPage: authPage
    };
  }
  else {
    console.log("X - Cancel dependency loading")
    if (stack.length == 0) {
      window.o.redirectTo = runtimeDapp.route;
    }
    else {
      window.o.redirectTo = stack[0].route;
    }
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
