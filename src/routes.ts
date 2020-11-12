// Components
import Home from './routes/Home.svelte'
import NotFound from './routes/NotFound.svelte'
//Dapp Overview
import Dapps from './dapps/Dapps.svelte'
// Wallet Dapp
import Safe from './dapps/wallet/pages/Safe.svelte'
import ConnectCircles from './dapps/wallet/pages/ConnectCircles.svelte'
import Invite from './dapps/wallet/pages/Invite.svelte'
import Register from './dapps/wallet/pages/Register.svelte'
import Trusts from './dapps/wallet/pages/Trusts.svelte'
import Tokens from './dapps/wallet/pages/Tokens.svelte'
// Identity Dapp
import Settings from './dapps/identity/pages/Settings.svelte'
import Login from './dapps/identity/pages/Login.svelte'


// Export the route definition object
export default {
    // Exact path
    '/': Home,
    // Wildcard parameter
    // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
    '/dapps': Dapps,
    // Wallet
    '/wallet/connect': ConnectCircles,
    '/wallet/invite': Invite,
    '/wallet/register': Register,
    '/wallet/:address/safe': Safe,
    '/wallet/:address/trusts': Trusts,
    '/wallet/:address/tokens': Tokens,
    // Identity
    '/identity/settings': Settings,
    '/identity/login': Login,
    // Dapps Overview
    '/dapps/*': Dapps,
    // Catch-all, must be last
    '*': NotFound,
}
