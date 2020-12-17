import Featured from './views/pages/Featured.svelte';

import { omofundingDefaultActions, omofundingOverflowActions } from './data/actions';
import {faPeopleCarry} from "@fortawesome/free-solid-svg-icons";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";

export interface OmoFundingState {}
export const omofunding : DappManifest<OmoFundingState,OmoFundingState> = {
  id: "omo.funding:1",
  dependencies: [],
  icon: faPeopleCarry,
  title: "OmoFunding",
  routeParts: ["omofunding"],
  tag: Promise.resolve("mockup"),
  isEnabled: true,
  pages:[{
    isDefault: true,
    routeParts: ["featured"],
    component: Featured,
    available: [
      (detail) => {
        console.log("routeGuard.detail:", detail);
        return window.o.fission !== undefined
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
