import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import Auth from "./pages/Auth.svelte";
import Authenticate from "./pages/Authenticate.svelte";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {omoSapienDefaultActions, omoSapienOverflowActions} from "../omosapien/data/actions";
import {AuthSucceeded, Continuation} from "webnative";
import {push} from "svelte-spa-router";
import {shellEvents} from "../../libs/o-os/shellEvents";

export interface FissionAuthState {
  fissionAuth: AuthSucceeded | Continuation
}

const authenticate = {
  isDefault: true,
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
  routeParts: ["auth"],
  component: Auth,
  available: []
};

export const fissionauth : DappManifest<FissionAuthState,FissionAuthState> = {
  id: "omo.fission.auth:1",
  dependencies: [],
  isHidden: false,
  isEnabled: true,
  icon: faCheckCircle,
  title: "Fission Auth",
  routeParts: ["fissionauth"],
  tag: Promise.resolve("beta"),
  initialize: async (stack, runtimeDapp) =>
  {
    if (runtimeDapp.shell.fissionAuth){
      console.log("Continue dependency loading ..")
      return {
        cancelDependencyLoading: false,
        initialPage: authPage,
        dappState: {
          fissionAuth: runtimeDapp.shell.fissionAuth
        }
      };
    } else {
      console.log("X - Cancel dependency loading")
      window.o.redirectTo = stack[0].route;
      return {
        cancelDependencyLoading: true,
        initialPage: authenticate,
        dappState: {
          fissionAuth: null
        }
      }
    }
  },
  pages: [
    authenticate,
    authPage
  ]
};
