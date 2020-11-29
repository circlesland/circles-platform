import Profile from 'src/dapps/odentity/views/pages/Profile.svelte'
import Access from 'src/dapps/odentity/views/pages/Access.svelte'
import Authenticate from 'src/dapps/odentity/views/pages/Authenticate.svelte'
import Keys from 'src/dapps/odentity/views/pages/Keys.svelte'

import {odentityDefaultActions, odentityOverflowActions} from "./data/actions"
import {PageManifest} from "../../libs/o-os/pageManifest";

export const profile: PageManifest = {
  component: Profile,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fissionAuth !== undefined
    }
  ],
  userData: {
    dapp: "odentity",
    showActionBar: true,
    actions: [
      ...odentityDefaultActions,
      ...odentityOverflowActions
    ]
  }
}

export const authenticate: PageManifest = {
  component: Authenticate,
  userData: {
    dapp: "odentity",
    actions: [
      ...odentityDefaultActions,
      ...odentityOverflowActions
    ]
  }
}

export const access: PageManifest = {
  component: Access,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fissionAuth !== undefined
    }
  ],
  userData: {
    dapp: "odentity",
    showActionBar: true,
    actions: [
      ...odentityDefaultActions,
      ...odentityOverflowActions
    ]
  }
}

export const keys: PageManifest = {
  component: Keys,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fissionAuth !== undefined
    }
  ],
  userData: {
    dapp: "odentity",
    showActionBar: true,
    actions: [
      ...odentityDefaultActions,
      ...odentityOverflowActions
    ]
  }
}
