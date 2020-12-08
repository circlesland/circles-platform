import Website from 'src/dapps/website/views/pages/Website.svelte'
import Explain from 'src/dapps/website/views/pages/Explain.svelte'
import Privacy from 'src/dapps/website/views/pages/Privacy.svelte'
import TOS from 'src/dapps/website/views/pages/TOS.svelte'

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

export const explain: PageManifest = {
  component: Explain,
  userData: {
    dapp: "website",
    showActionBar: false,
    actions: []
  }
}
