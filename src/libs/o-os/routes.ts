// Components
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import wrap from "svelte-spa-router/wrap";
import { location } from 'svelte-spa-router'
import { OmoEvent } from "../o-events/omoEvent";

import { transactions, tokens, friends, answerInviteRequest } from "../../dapps/safe/manifest";
import { omoli } from "../../dapps/omoli/manifest";
import { profile, access, keys, authenticate } from "../../dapps/omosapien/manifest";
import { website } from "../../dapps/website/manifest";

// Export the route definition object
export default {
    // Website
    '/': wrap(website),

    // Omo
    '/omoli/*': wrap(omoli),

    // OmoSapien
    '/omosapien/profile': wrap(profile),
    '/omosapien/authenticate/:redirectTo?': wrap(authenticate),
    '/omosapien/access': wrap(access),
    '/omosapien/keys': wrap(keys),

    // Safe
    '/empowerMe/:from': wrap(answerInviteRequest),
    '/safe/transactions': wrap(transactions),
    '/safe/friends': wrap(friends),
    '/safe/tokens': wrap(tokens),

    // Catch-all, must be last
    '*': NotFound,
}

