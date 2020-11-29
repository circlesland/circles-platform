// Components
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import wrap from "svelte-spa-router/wrap";
import { location } from 'svelte-spa-router'
import { OmoEvent } from "../o-events/omoEvent";

import { transactions, tokens, friends } from "../../dapps/safe/manifest";
import { omo } from "../../dapps/omo/manifest";
import {profile, access, keys, authenticate} from "../../dapps/odentity/manifest";
import { website } from "../../dapps/website/manifest";

export type ActionBarAction = {
    type: "route" | "trigger",
    pos: "1" | "2" | "3" | "4" | "overflow",
    mapping: {
        design: {
            icon: any
        },
        data: {
            label: string
        }
    }
    event?: () => OmoEvent,
    route?: string
}

location.subscribe(event => {
    console.log(event);
})

// Export the route definition object
export default {
    // Website
    '/': wrap(website),

    // Omo
    '/omo/*': wrap(omo),

    // Odentity
    '/odentity/profile': wrap(profile),
    '/odentity/authenticate': wrap(authenticate),
    '/odentity/access': wrap(access),
    '/odentity/keys': wrap(keys),

    // Safe
    '/safe/transactions': wrap(transactions),
    '/safe/friends': wrap(friends),
    '/safe/tokens': wrap(tokens),

    // Catch-all, must be last
    '*': NotFound,
}

