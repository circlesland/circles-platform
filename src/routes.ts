// Components
import Website from 'src/dapps/website/pages/Website.svelte'
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import Dapps from 'src/dapps/omo/pages/Dapps.svelte'
import Safe from 'src/dapps/wallet/pages/Safe.svelte'
import Start from 'src/dapps/wallet/pages/Start.svelte'
import Friends from 'src/dapps/wallet/pages/Friends.svelte'
import Tokens from 'src/dapps/wallet/pages/Tokens.svelte'
import Register from 'src/dapps/wallet/pages/Register.svelte'
import Settings from 'src/dapps/identity/pages/Settings.svelte'
import Login from 'src/dapps/identity/pages/Login.svelte'
import wrap from "svelte-spa-router/wrap";
import { location } from 'svelte-spa-router'
import { OmoEvent } from "./libs/o-events/omoEvent";
import { RunProcess } from "./libs/o-events/runProcess";
import { requestUbi } from "./dapps/wallet/processes/requestUbi/requestUbi";
import { transferXDai } from "./dapps/wallet/processes/transferXDai/transferXDai";
import { setTrust, SetTrustContext } from "./dapps/wallet/processes/setTrust/setTrust";
import { transferCircles } from "./dapps/wallet/processes/transferCircles/transferCircles";
import { connectSafe } from "./dapps/wallet/processes/connectSafe/connectSafe";
import { faCogs, faCoins, faHome, faPiggyBank, faUserFriends } from "@fortawesome/free-solid-svg-icons";

export type ActionBarAction = {
    type: "route" | "trigger",
    pos: "1" | "2" | "3" | "4" | "overflow",
    icon: any,
    label: string,
    event?: () => OmoEvent,
    route?: string
}

const safeDefaultActions = [{
    type: "route",
    pos: "1",
    icon: faPiggyBank,
    label: "Safe",
    route: "#/wallet/safe"
}, {
    type: "route",
    pos: "2",
    icon: faCoins,
    label: "Tokens",
    route: "#/wallet/tokens"
}, {
    type: "route",
    pos: "3",
    icon: faUserFriends,
    label: "Friends",
    route: "#/wallet/friends"
}, {
    type: "route",
    pos: "4",
    icon: faHome,
    label: "Home",
    route: "#/omo/dapps"
}];

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
                icon: faCoins,
                label: "Connect Circles Safe",
                event: () => new RunProcess(connectSafe)
            }]
        }
    }),
    // Identity
    '/identity/settings': wrap({
        component: Settings,
        userData: {
            actions: []
        }
    }),
    '/identity/login': Login,
    // Wallet
    '/wallet/start': wrap({
        component: Start,
        userData: {
            actions: safeDefaultActions
        }
    }),
    '/wallet/register': Register,
    //'/wallet/jumpstart/:address': Jumpstart,
    '/wallet/safe': wrap({
        component: Safe,
        userData: {
            actions: <ActionBarAction[]>[
                ...safeDefaultActions
                , {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Get UBI",
                    event: () => new RunProcess(requestUbi)
                }, {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Send xDai",
                    event: () => new RunProcess(transferXDai)
                }, {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Trust friend",
                    event: () => new RunProcess(setTrust, (context: SetTrustContext) => {
                        context.setTrust = { trustLimit: { type: 'percent', data: 100 } };
                        return context;
                    })
                },
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
            ]
        }
    }),
    '/wallet/friends': wrap({
        component: Friends,
        userData: {
            actions: <ActionBarAction[]>[
                ...safeDefaultActions
                , {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Get UBI",
                    event: () => new RunProcess(requestUbi)
                }, {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Send xDai",
                    event: () => new RunProcess(transferXDai)
                }, {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Trust friend",
                    event: () => new RunProcess(setTrust, (context: SetTrustContext) => {
                        context.setTrust = { trustLimit: { type: 'percent', data: 100 } };
                        return context;
                    })
                },
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
            ]
        }
    }),
    '/wallet/tokens': wrap({
        component: Tokens,
        userData: {
            actions: <ActionBarAction[]>[
                ...safeDefaultActions
                , {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Get UBI",
                    event: () => new RunProcess(requestUbi)
                }, {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Send xDai",
                    event: () => new RunProcess(transferXDai)
                }, {
                    type: "trigger",
                    pos: "overflow",
                    icon: faCoins,
                    label: "Trust friend",
                    event: () => new RunProcess(setTrust, (context: SetTrustContext) => {
                        context.setTrust = { trustLimit: { type: 'percent', data: 100 } };
                        return context;
                    })
                },
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
            ]
        }
    }),
    // Catch-all, must be last
    '*': NotFound,
}
