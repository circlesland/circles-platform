import Website from 'src/dapps/website/views/pages/Website.svelte'
import {PageManifest} from "../../libs/o-os/pageManifest";

export const website: PageManifest = {
  component: Website,
  userData: {
    dapp: "website",
    showActionBar: false,
    actions: []
  }
}
