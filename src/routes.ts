// Components
import Website from 'src/dapps/website/pages/Website.svelte'
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
//Dapp Overview
import Dapps from 'src/dapps/omo/pages/Dapps.svelte'
// Wallet Dapp
import Safe from 'src/dapps/wallet/pages/Safe.svelte'
import ConnectCircles from 'src/dapps/wallet/pages/ConnectCircles.svelte'
import Start from 'src/dapps/wallet/pages/Start.svelte'
import Trusts from 'src/dapps/wallet/pages/Trusts.svelte'
import Tokens from 'src/dapps/wallet/pages/Tokens.svelte'
import Register from 'src/dapps/wallet/pages/Register.svelte'

// Identity Dapp
import Settings from 'src/dapps/identity/pages/Settings.svelte'
import Login from 'src/dapps/identity/pages/Login.svelte'
import wrap from "svelte-spa-router/wrap";
import { location } from 'svelte-spa-router'

export type ActionBarAction = {
    type: "route" | "trigger",
    pos: "1" | "2" | "3" | "4" | "overflow",
    icon: string,
    label: string,
    event?: any,
    route?: string
}

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
            actions: []
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
    '/wallet/connect': wrap({
        component: ConnectCircles,
        userData: {
            actions: [{
                type: "round",
                pos: "1",
                icon: "fa-cogs",
                label: "Open Modal",
                event: "showModal"
            }, {
                type: "round",
                pos: "2",
                icon: "fa-cogs",
                label: "123",
                event: "showModal"
            }]
        }
    }),
    '/wallet/start': Start,
    '/wallet/register': Register,
    //'/wallet/jumpstart/:address': Jumpstart,
    '/wallet/safe': wrap({
        component: Safe,
        userData: {
            actions: <ActionBarAction[]>[{
                type: "route",
                pos: "1",
                icon: "piggy-bank",
                label: "Safe",
                route: "#/wallet/safe"
            }, {
                type: "route",
                pos: "2",
                icon: "coins",
                label: "Tokens",
                route: "#/wallet/tokens"
            }, {
                type: "route",
                pos: "3",
                icon: "user-friends",
                label: "Friends",
                route: "#/wallet/trusts"
            }, {
                type: "route",
                pos: "4",
                icon: "home",
                label: "Home",
                route: "#/omo/dapps"
            }, {
                type: "route",
                pos: "overflow",
                icon: "home",
                label: "Oida",
                route: "#/omo/dapps"
            }]
        }
    }),
    '/wallet/trusts': Trusts,
    '/wallet/tokens': Tokens,
    // Catch-all, must be last
    '*': NotFound,
}
