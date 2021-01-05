import Movies from 'src/dapps/omomovies/views/pages/Movies.svelte';
import { omomoviesDefaultActions, omomoviesOverflowActions } from './data/actions';
import { faFilm } from "@fortawesome/free-solid-svg-icons";
export const omomovies = {
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
};
