// Components
import Website from "src/dapps/website/views/pages/Website.svelte"
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import Dapps from 'src/dapps/omo/views/pages/Dapps.svelte'
import Safe from 'src/dapps/wallet/views/pages/Safe.svelte'
import Friends from 'src/dapps/wallet/views/pages/Friends.svelte'
import Tokens from 'src/dapps/wallet/views/pages/Tokens.svelte'
import Login from 'src/dapps/identity/views/pages/Login.svelte'
import wrap from "svelte-spa-router/wrap";
import { location } from 'svelte-spa-router'
import { OmoEvent } from "./libs/o-events/omoEvent";
import { RunProcess } from "./libs/o-events/runProcess";
import { requestUbi } from "./dapps/wallet/processes/requestUbi/requestUbi";
import { transferXDai } from "./dapps/wallet/processes/transferXDai/transferXDai";
import { setTrust, SetTrustContext } from "./dapps/wallet/processes/setTrust/setTrust";
import { transferCircles } from "./dapps/wallet/processes/transferCircles/transferCircles";
import { connectSafe } from "./dapps/wallet/processes/connectSafe/connectSafe";
import { faCoins, faUserCircle, faPiggyBank, faUserFriends } from "@fortawesome/free-solid-svg-icons";

export type ActionBarAction = {
    type: "route" | "trigger",
    pos: "1" | "2" | "3" | "4" | "overflow",
    mapping: {
        design: {
            icon: any
        },
        data: {
            label: string
        }
    }
    event?: () => OmoEvent,
    route?: string
}

const safeDefaultActions = [
    {
        type: "route",
        pos: "1",
        mapping: {
            design: {
                icon: faPiggyBank
            },
            data: {
                label: "Safe"
            }
        },
        route: "#/wallet/safe"
    }, {
        type: "route",
        pos: "2",
        mapping: {
            design: {
                icon: faCoins,
            },
            data: {
                label: "Tokens"
            }
        },
        route: "#/wallet/tokens"
    }, {
        type: "route",
        pos: "3",
        mapping: {
            design: {
                icon: faUserFriends,
            },
            data: {
                label: "Friends",
            }
        },
        route: "#/wallet/friends"
    }, {
        type: "route",
        pos: "4",
        mapping: {
            design: {
                icon: faUserCircle,
            },
            data: {
                label: "Home",
            }
        },
        route: "#/omo/dapps"
    }];

const safeOverflowActions = [
    {
        type: "trigger",
        pos: "overflow",
        mapping: {
            design: {
                icon: faCoins
            },
            data: {
                label: "Get UBI"
            }
        },
        event: () => new RunProcess(requestUbi)
    },
    // {
    //     type: "trigger",
    //     pos: "overflow",
    //     icon: faCoins,
    //     label: "Send xDai",
    //     event: () => new RunProcess(transferXDai)
    // }, 
    {
        type: "trigger",
        pos: "overflow",
        mapping: {
            design: {
                icon: faCoins,
            },
            data: {
                label: "Trust friend",
            }
        },
        event: () => new RunProcess(setTrust, (context: SetTrustContext) => {
            context.setTrust = { trustLimit: { type: 'percent', data: 100 } };
            return context;
        })
    }
    // {
    //     type: "trigger",
    //     pos: "overflow",
    //     icon: "coins",
    //     label: "Send money",
    //     event: () => new RunProcess(transferCircles)
    // }, {
    //     type: "trigger",
    //     pos: "overflow",
    //     icon: "coins",
    //     label: "Receive money",
    //     //event: () => new RunProcess(requestUbi)
    // }
];

location.subscribe(event => {
    console.log(event);
})

// Export the route definition object
export default {
    // Omo-Website
    '/': Website,
    // Wildcard parameter
    // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
    '/omo/*': wrap({
        component: Dapps,
        userData: {
            actions: [{
                type: "trigger",
                pos: "overflow",
                mapping: {
                    design: {
                        icon: faCoins,
                    },
                    data: {
                        label: "Connect Circles Safe"
                    }
                },
                event: () => new RunProcess(connectSafe)
            }]
        }
    }),
    // Identity
    '/identity/login': wrap({
        component: Login,
        userData: {}
    }),
    // Wallet
    '/wallet/safe': wrap({
        component: Safe,
        userData: {
            actions: <ActionBarAction[]>[
                ...safeDefaultActions,
                ...safeOverflowActions
            ]
        }
    }),
    '/wallet/friends': wrap({
        component: Friends,
        userData: {
            actions: <ActionBarAction[]>[
                ...safeDefaultActions,
                ...safeOverflowActions
            ]
        }
    }),
    '/wallet/tokens': wrap({
        component: Tokens,
        userData: {
            actions: <ActionBarAction[]>[
                ...safeDefaultActions,
                ...safeOverflowActions
            ]
        }
    }),
    // Catch-all, must be last
    '*': NotFound,
}

