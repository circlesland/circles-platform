import Offers from 'src/dapps/omomarket/views/pages/Offers.svelte'
import Requests from 'src/dapps/omomarket/views/pages/Requests.svelte'
import Favorites from 'src/dapps/omomarket/views/pages/Favorites.svelte'

import { omomarketDefaultActions, omomarketOverflowActions } from './data/actions';
import {faPeopleCarry} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";

export interface OmoMarketState {}
export const omomarket : DappManifest<OmoMarketState> = {
  dappId: "omo.market:1",
  isSingleton: true,
  dependencies: ["omo.safe:1"], // TODO: Needs access to the contact list which is currently in the safe
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
        window.o.logger.log("routeGuard.detail:", detail);
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
        window.o.logger.log("routeGuard.detail:", detail);
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
        window.o.logger.log("routeGuard.detail:", detail);
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
