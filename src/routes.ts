// Components
import Website from 'src/dapps/omo-website/pages/Website.svelte'
import NotFound from 'src/routes/NotFound.svelte'
//Dapp Overview
import Dapps from 'src/dapps/omo-li/pages/Dapps.svelte'
// Wallet Dapp
import Safe from 'src/dapps/omo-wallet/pages/Safe.svelte'
import ConnectCircles from 'src/dapps/omo-wallet/pages/ConnectCircles.svelte'
import Invite from 'src/dapps/omo-wallet/pages/Invite.svelte'
import Register from 'src/dapps/omo-wallet/pages/Register.svelte'
import Trusts from 'src/dapps/omo-wallet/pages/Trusts.svelte'
import Tokens from 'src/dapps/omo-wallet/pages/Tokens.svelte'
// Identity Dapp
import Settings from 'src/dapps/omo-sapien/pages/Settings.svelte'
import Login from 'src/dapps/omo-sapien/pages/Login.svelte'
// Test Dapp
import Start from "src/dapps/omo-li/pages/Start.svelte"


// Export the route definition object
export default {
    // Exact path
    '/': Website,
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
    '/dapp/*': Dapps,
    // Test
    '/test/start': Start,
    // Catch-all, must be last
    '*': NotFound,
}
