import Profile from 'src/dapps/omosapien/views/pages/Profile.svelte'
import Access from 'src/dapps/omosapien/views/pages/Access.svelte'
import Authenticate from 'src/dapps/omosapien/views/pages/Authenticate.svelte'
import Keys from 'src/dapps/omosapien/views/pages/Keys.svelte'
import { omoSapienDefaultActions, omoSapienOverflowActions } from "./data/actions"
import { PageManifest } from "../../libs/o-os/interfaces/pageManifest";

export const profile: PageManifest = {
  component: Profile,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    dapp: "omosapien",
    showActionBar: true,
    actions: [
      ...omoSapienDefaultActions,
      ...omoSapienOverflowActions
    ]
  }
}

export const authenticate: PageManifest = {
  component: Authenticate,
  userData: {
    dapp: "omosapien",
    actions: [
      ...omoSapienDefaultActions,
      ...omoSapienOverflowActions
    ]
  }
}

export const access: PageManifest = {
  component: Access,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    dapp: "omosapien",
    showActionBar: true,
    actions: [
      ...omoSapienDefaultActions,
      ...omoSapienOverflowActions
    ]
  }
}

export const keys: PageManifest = {
  component: Keys,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    dapp: "omosapien",
    showActionBar: true,
    actions: [
      ...omoSapienDefaultActions,
      ...omoSapienOverflowActions
    ]
  }
}
