import Offers from 'src/dapps/omomarket/views/pages/Offers.svelte'
import Requests from 'src/dapps/omomarket/views/pages/Requests.svelte'
import Favorites from 'src/dapps/omomarket/views/pages/Favorites.svelte'

import { PageManifest } from "../../libs/o-os/interfaces/pageManifest";
import { omomarketDefaultActions, omomarketOverflowActions } from './data/actions';

export const offers: PageManifest = {
  component: Offers,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    dapp: "omomarket",
    showActionBar: true,
    actions: [
      ...omomarketDefaultActions,
      ...omomarketOverflowActions
    ]
  }
}

export const requests: PageManifest = {
  component: Requests,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    dapp: "omomarket",
    showActionBar: true,
    actions: [
      ...omomarketDefaultActions,
      ...omomarketOverflowActions
    ]
  }
}

export const favorites: PageManifest = {
  component: Favorites,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    dapp: "omomarket",
    showActionBar: true,
    actions: [
      ...omomarketDefaultActions,
      ...omomarketOverflowActions
    ]
  }
}
