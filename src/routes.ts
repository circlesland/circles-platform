// Components
import Home from './routes/Home.svelte'
import Dapps from './routes/Dapps.svelte'
import Wallet from './routes/Wallet.svelte'
import NotFound from './routes/NotFound.svelte'

// Export the route definition object
export default {
    // Exact path
    '/': Home,

    // Wildcard parameter
    // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
    '/dapps': Dapps,
    '/wallet': Wallet,
    '/dapps/*': Dapps,

    // Catch-all, must be last
    '*': NotFound,
}