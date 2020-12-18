import Offers from 'src/dapps/omomarket/views/pages/Offers.svelte'
import Requests from 'src/dapps/omomarket/views/pages/Requests.svelte'
import Favorites from 'src/dapps/omomarket/views/pages/Favorites.svelte'

import { omomarketDefaultActions, omomarketOverflowActions } from './data/actions';
import {faPeopleCarry} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {tryGetDappState} from "../../libs/o-os/loader";
import {FissionAuthState} from "../fissionauth/manifest";

export interface OmoMarketState {}
export const omomarket : DappManifest<OmoMarketState,OmoMarketState> = {
  id: "omo.market:1",
  dependencies: [],
  icon: faPeopleCarry,
  title: "OmoMarket",
  routeParts: ["omomarket"],
  tag: Promise.resolve("mockup"),
  isEnabled: true,
  pages:[{
    isDefault: true,
    routeParts: ["offers"],
    component: Offers,
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
        ...omomarketDefaultActions,
        ...omomarketOverflowActions
      ]
    }
  }, {
    routeParts: ["requests"],
    component: Requests,
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
        ...omomarketDefaultActions,
        ...omomarketOverflowActions
      ]
    }
  }, {
    routeParts: ["favorites"],
    component: Favorites,
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
        ...omomarketDefaultActions,
        ...omomarketOverflowActions
      ]
    }
  }]
};
