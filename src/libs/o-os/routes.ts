// Components
import NotFound from 'src/libs/o-views/pages/NotFound.svelte'
import wrap from "svelte-spa-router/wrap";

import { transactions, tokens, friends, answerInviteRequest } from "../../dapps/safe/manifest";
import { omoli } from "../../dapps/omoli/manifest";
import { profile, access, keys, authenticate } from "../../dapps/omosapien/manifest";
import { website, visionpaper, privacy, tos, attributions } from "../../dapps/website/manifest";
import { offers, requests, favorites } from "../../dapps/omomarket/manifest";
import { featured } from "../../dapps/omofunding/manifest";
import { movies } from "../../dapps/omomovies/manifest";


import Auth from 'src/dapps/fissionauth/pages/Auth.svelte'
import Drive from 'src/dapps/fissiondrive/pages/Drive.svelte'

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

  // Omo Funding
  '/omomovies/movies': wrap(movies),


  // Omo Funding
  '/fissionauth/auth': Auth,

  // Omo Funding
  '/fissiondrive/drive': Drive,

  // Catch-all, must be last
  '*': NotFound,
}

