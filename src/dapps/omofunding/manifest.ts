import Featured from './views/pages/Featured.svelte';

import { PageManifest } from "../../libs/o-os/interfaces/pageManifest";
import { omofundingDefaultActions, omofundingOverflowActions } from './data/actions';

export const featured: PageManifest = {
  component: Featured,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fission !== undefined
    }
  ],
  userData: {
    dapp: "omofunding",
    showActionBar: true,
    actions: [
      ...omofundingDefaultActions,
      ...omofundingOverflowActions
    ]
  }
}
