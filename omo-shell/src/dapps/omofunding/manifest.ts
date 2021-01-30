import Featured from './views/pages/Featured.svelte';

import { omofundingDefaultActions, omofundingOverflowActions } from './data/actions';
import { faPeopleCarry } from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";

export interface OmoFundingState { }
export const omofunding: DappManifest<OmoFundingState> = {
  dappId: "omo.funding:1",
  isSingleton: true,
  dependencies: [],
  icon: faPeopleCarry,
  title: "OmoFunding",
  routeParts: ["omofunding"],
  tag: Promise.resolve("mockup"),
  isEnabled: false,
  pages: [{
    isDefault: true,
    routeParts: ["featured"],
    component: Featured,
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
        ...omofundingDefaultActions,
        ...omofundingOverflowActions
      ]
    }
  }]
};
