// Components
import Home from './routes/Home.svelte'
import NotFound from './routes/NotFound.svelte'

import Dapps from './dapps/Dapps.svelte'
import Safe from './dapps/wallet/pages/Safe.svelte'
import ConnectCirlces from './dapps/wallet/pages/ConnectCirlces.svelte'
import Trusts from './dapps/wallet/pages/Trusts.svelte'
import Tokens from './dapps/wallet/pages/Tokens.svelte'

// Export the route definition object
export default {
    // Exact path
    '/': Home,

    // Wildcard parameter
    // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
    '/dapps': Dapps,
    '/wallet/connect': ConnectCirlces,
    '/wallet/:address/safe': Safe,
    '/wallet/:address/trusts': Trusts,
    '/wallet/:address/tokens': Tokens,
    '/dapps/*': Dapps,

    // Catch-all, must be last
    '*': NotFound,
}
