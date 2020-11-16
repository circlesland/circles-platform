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
import Jumpstart from 'src/dapps/wallet/pages/Jumpstart.svelte'
import Register from 'src/dapps/wallet/pages/Register.svelte'

// Identity Dapp
import Settings from 'src/dapps/identity/pages/Settings.svelte'
import Login from 'src/dapps/identity/pages/Login.svelte'

// Export the route definition object
export default {
    // Omo-Website
    '/': Website,
    // Wildcard parameter
    // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
    '/omo/*': Dapps,
    // Identity
    '/identity/settings': Settings,
    '/identity/login': Login,
    // Wallet
    '/wallet/connect': ConnectCircles,
    '/wallet/start': Start,
    '/wallet/register': Register,
    '/wallet/jumpstart/:address': Jumpstart,
    '/wallet/:address/safe': Safe,
    '/wallet/:address/trusts': Trusts,
    '/wallet/:address/tokens': Tokens,
    // Catch-all, must be last
    '*': NotFound,
}
