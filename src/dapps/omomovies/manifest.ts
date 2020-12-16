import Movies from 'src/dapps/omomovies/views/pages/Movies.svelte'

import { PageManifest } from "../../libs/o-os/interfaces/pageManifest";

export const movies: PageManifest = {
  component: Movies,
  userData: {
    dapp: "omomovies",
    showActionBar: true,
    actions: []
  }
}
