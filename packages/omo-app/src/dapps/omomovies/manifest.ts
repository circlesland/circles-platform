import Movies from 'src/dapps/omomovies/views/pages/Movies.svelte'

import { omomoviesDefaultActions, omomoviesOverflowActions } from './data/actions';
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { DappManifest } from "../../libs/o-os/interfaces/dappManifest";

export interface OmoMoviesState { }
export const omomovies: DappManifest<OmoMoviesState, OmoMoviesState> = {
  id: "omo.movies:1",
  dependencies: [],
  icon: faFilm,
  title: "Movies",
  routeParts: ["omomovies"],
  tag: Promise.resolve("mockup"),
  isEnabled: false,
  isHidden: false,
  pages: [{
    isDefault: true,
    routeParts: ["movies"],
    component: Movies,
    userData: {
      showActionBar: true,
      actions: [
        ...omomoviesDefaultActions,
        ...omomoviesOverflowActions
      ]
    }
  }]
}
