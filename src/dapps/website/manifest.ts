import Website from 'src/dapps/website/views/pages/Website.svelte'
import Whitepaper from 'src/dapps/website/views/pages/Whitepaper.svelte'
import Privacy from 'src/dapps/website/views/pages/Privacy.svelte'
import TOS from 'src/dapps/website/views/pages/TOS.svelte'
import Attributions from 'src/dapps/website/views/pages/Attributions.svelte'


import { PageManifest } from "../../libs/o-os/interfaces/pageManifest";

export const website: PageManifest = {
  component: Website,
  userData: {
    dapp: "website",
    showActionBar: false,
    actions: []
  }
}

export const privacy: PageManifest = {
  component: Privacy,
  userData: {
    dapp: "website",
    showActionBar: false,
    actions: []
  }
}

export const tos: PageManifest = {
  component: TOS,
  userData: {
    dapp: "website",
    showActionBar: false,
    actions: []
  }
}

export const attributions: PageManifest = {
  component: Attributions,
  userData: {
    dapp: "website",
    showActionBar: false,
    actions: []
  }
}

export const whitepaper: PageManifest = {
  component: Whitepaper,
  userData: {
    dapp: "website",
    showActionBar: false,
    actions: []
  }
}
