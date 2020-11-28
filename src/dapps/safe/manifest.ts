import Transactions from "./views/pages/Transactions.svelte"
import Friends from "./views/pages/Friends.svelte"
import Tokens from "./views/pages/Tokens.svelte"
import { safeDefaultActions, safeOverflowActions } from "./data/actions"
import { ActionBarAction } from "src/libs/o-os/routes";

export const transactions = {
    component: Transactions,
    userData: {
        actions: <ActionBarAction[]>[
            ...safeDefaultActions,
            ...safeOverflowActions
        ]
    }
}

export const friends = {
    component: Friends,
    userData: {
        actions: <ActionBarAction[]>[
            ...safeDefaultActions,
            ...safeOverflowActions
        ]
    }
}

export const tokens = {
    component: Tokens,
    userData: {
        actions: <ActionBarAction[]>[
            ...safeDefaultActions,
            ...safeOverflowActions
        ]
    }
}