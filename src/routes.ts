// Components
import Home from './routes/Home.svelte'
import NotFound from './routes/NotFound.svelte'

import Dapps from './dapps/Dapps.svelte'
import Transactions from './dapps/wallet/Safe.svelte'
import Trusts from './dapps/wallet/Trusts.svelte'
import Tokens from './dapps/wallet/Tokens.svelte'

// Export the route definition object
export default {
    // Exact path
    '/': Home,

    // Wildcard parameter
    // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
    '/dapps': Dapps,
    '/wallet/safe': Transactions,
    '/wallet/trusts': Trusts,
    '/wallet/tokens': Tokens,
    '/dapps/*': Dapps,

    // Catch-all, must be last
    '*': NotFound,
}