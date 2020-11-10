// Components
import Home from './routes/Home.svelte'
import NotFound from './routes/NotFound.svelte'
//Dapp Overview
import Dapps from './dapps/Dapps.svelte'
// Wallet Dapp
import Safe from './dapps/wallet/pages/Safe.svelte'
import ConnectCirlces from './dapps/wallet/pages/ConnectCirlces.svelte'
import Trusts from './dapps/wallet/pages/Trusts.svelte'
import Tokens from './dapps/wallet/pages/Tokens.svelte'
// Identity Dapp
import Settings from './dapps/identity/pages/Settings.svelte'

// Export the route definition object
export default {
    // Exact path
    '/': Home,
    // Wildcard parameter
    // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
    '/dapps': Dapps,
    // Wallet
    '/wallet/connect': ConnectCirlces,
    '/wallet/:address/safe': Safe,
    '/wallet/:address/trusts': Trusts,
    '/wallet/:address/tokens': Tokens,
    // Identity
    '/identity/settings': Settings,
    '/dapps/*': Dapps,
    // Catch-all, must be last
    '*': NotFound,
}
