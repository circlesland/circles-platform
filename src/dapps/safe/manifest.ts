import Transactions from "./views/pages/Transactions.svelte"
import Friends from "./views/pages/Friends.svelte"
import Tokens from "./views/pages/Tokens.svelte"
import {safeDefaultActions, safeOverflowActions} from "./data/actions"
import {ActionBarAction} from "src/libs/o-os/routes";
import {PageManifest} from "../../libs/o-os/pageManifest";

export const transactions: PageManifest = {
  component: Transactions,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fissionAuth !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    dapp: "safe",
    actions: <ActionBarAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
}

export const friends: PageManifest = {
  component: Friends,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fissionAuth !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    dapp: "safe",
    actions: <ActionBarAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
}

export const tokens: PageManifest = {
  component: Tokens,
  conditions: [
    (detail) => {
      console.log("routeGuard.detail:", detail);
      return window.o.fissionAuth !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    dapp: "safe",
    actions: <ActionBarAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
}
