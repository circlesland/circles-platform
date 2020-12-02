// Components
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import wrap from "svelte-spa-router/wrap";
import { location } from 'svelte-spa-router'
import { OmoEvent } from "../o-events/omoEvent";

import {transactions, tokens, friends, answerInviteRequest} from "../../dapps/safe/manifest";
import { omo } from "../../dapps/omo/manifest";
import {profile, access, keys, authenticate} from "../../dapps/odentity/manifest";
import { website } from "../../dapps/website/manifest";

// Export the route definition object
export default {
    // Website
    '/': wrap(website),

    // Omo
    '/omo/*': wrap(omo),

    // Odentity
    '/odentity/profile': wrap(profile),
    '/odentity/authenticate/:redirectTo?': wrap(authenticate),
    '/odentity/access': wrap(access),
    '/odentity/keys': wrap(keys),

    // Safe
    '/safe/answerInviteRequest/:from': wrap(answerInviteRequest),
    '/safe/transactions': wrap(transactions),
    '/safe/friends': wrap(friends),
    '/safe/tokens': wrap(tokens),

    // Catch-all, must be last
    '*': NotFound,
}

