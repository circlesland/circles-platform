// Components
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import wrap from "svelte-spa-router/wrap";

import { transactions, tokens, friends, answerInviteRequest } from "../../dapps/safe/manifest";
import { omoli } from "../../dapps/omoli/manifest";
import { profile, access, keys, authenticate } from "../../dapps/omosapien/manifest";
import { website, visionpaper, privacy, tos, attributions } from "../../dapps/website/manifest";
import { offers, requests, favorites } from "../../dapps/omomarket/manifest";
import { featured } from "../../dapps/omofunding/manifest";



// Export the route definition object
export default {
  // Website
  '/': wrap(website),
  '/visionpaper': wrap(visionpaper),
  '/attributions': wrap(attributions),
  '/privacy': wrap(privacy),
  '/tos': wrap(tos),

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

  // Omo Market
  '/omomarket/offers': wrap(offers),
  '/omomarket/requests': wrap(requests),
  '/omomarket/favorites': wrap(favorites),

  // Omo Funding
  '/omofunding/featured': wrap(featured),

  // Catch-all, must be last
  '*': NotFound,
}

