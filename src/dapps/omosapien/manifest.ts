import Profile from 'src/dapps/omosapien/views/pages/Profile.svelte'
import Access from 'src/dapps/omosapien/views/pages/Access.svelte'
import Keys from 'src/dapps/omosapien/views/pages/Keys.svelte'
import { omoSapienDefaultActions, omoSapienOverflowActions } from "./data/actions"
import {faUserAstronaut} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {Profile as ProfileEntity} from "../../libs/o-fission/entities/profile";
import {RunProcess} from "../../libs/o-events/runProcess";
import {createOmoSapien} from "./processes/createOmoSapien/createOmoSapien";
import {setDappState, tryGetDappState} from "../../libs/o-os/loader";
import {FissionAuthState} from "../fissionauth/manifest";

export interface OmoSapienState {
  myProfile?: ProfileEntity
}

async function tryInitMyProfile()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const myProfile = await fissionAuthState.fission.profiles.tryGetMyProfile();

  setDappState<OmoSapienState>("omo.sapien:1", currentState =>
  {
    return {
      ...currentState,
      myProfile: myProfile
    };
  });
}

/**
 * Checks if the user already has a profile.
 * If not, starts the process to create a new Omosapien and cancels the loading.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack, runtimeDapp)
{
  await tryInitMyProfile();

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  if (!omosapienState.myProfile)
  {
    runtimeDapp.shell.publishEvent(new RunProcess(createOmoSapien));

    return {
      cancelDependencyLoading: true,
      initialPage: null
    }
  }

  return {
    cancelDependencyLoading: false,
    initialPage: null
  }
}

export const omosapien : DappManifest<OmoSapienState,OmoSapienState> = {
  id: "omo.sapien:1",
  dependencies: ["omo.fission.auth:1"],
  icon: faUserAstronaut,
  title: "OmoSapien",
  routeParts: ["omosapien"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: initialize,
  pages: [{
    isDefault: true,
    routeParts: ["profile"],
    component: Profile,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
        return fissionAuthState.fission !== undefined
      }
    ],
    userData: {
      showActionBar: true,
      actions: [
        ...omoSapienDefaultActions,
        ...omoSapienOverflowActions
      ]
    }
  }, {
    routeParts: ["access"],
    component: Access,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
        return fissionAuthState.fission !== undefined
      }
    ],
    userData: {
      showActionBar: true,
      actions: [
        ...omoSapienDefaultActions,
        ...omoSapienOverflowActions
      ]
    }
  }, {
    routeParts: ["keys"],
    component: Keys,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
        return fissionAuthState.fission !== undefined
      }
    ],
    userData: {
      showActionBar: true,
      actions: [
        ...omoSapienDefaultActions,
        ...omoSapienOverflowActions
      ]
    }
  }]
};
