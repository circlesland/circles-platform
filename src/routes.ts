// Components
import Home from 'src/routes/Home.svelte'
import NotFound from 'src/routes/NotFound.svelte'
//Dapp Overview
import Dapps from 'src/dapps/Dapps.svelte'
// Wallet Dapp
import Safe from 'src/dapps/wallet/pages/Safe.svelte'
import ConnectCircles from 'src/dapps/wallet/pages/ConnectCircles.svelte'
import Invite from 'src/dapps/wallet/pages/Invite.svelte'
import Register from 'src/dapps/wallet/pages/Register.svelte'
import Trusts from 'src/dapps/wallet/pages/Trusts.svelte'
import Tokens from 'src/dapps/wallet/pages/Tokens.svelte'
// Identity Dapp
import Settings from 'src/dapps/identity/pages/Settings.svelte'
import Login from 'src/dapps/identity/pages/Login.svelte'


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
