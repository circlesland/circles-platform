import Profile from 'src/dapps/omosapien/views/pages/Profile.svelte'
import Access from 'src/dapps/omosapien/views/pages/Access.svelte'
import Keys from 'src/dapps/omosapien/views/pages/Keys.svelte'
import { omoSapienDefaultActions, omoSapienOverflowActions } from "./data/actions"
import {faUserAstronaut} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";

export interface OmoSapienState {}
export const omosapien : DappManifest<OmoSapienState,OmoSapienState> = {
  id: "omo.sapien:1",
  dependencies: ["omo.fission.auth:1"],
  icon: faUserAstronaut,
  title: "OmoSapien",
  routeParts: ["omosapien"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  pages: [{
    isDefault: true,
    routeParts: ["profile"],
    component: Profile,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        return window.o.fission !== undefined
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
        return window.o.fission !== undefined
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
        return window.o.fission !== undefined
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
