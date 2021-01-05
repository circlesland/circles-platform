import { faUserCircle, faCoins, faFilm } from "@fortawesome/free-solid-svg-icons";
export const omomoviesDefaultActions = [
    {
        type: "route",
        pos: "1",
        mapping: {
            design: {
                icon: faFilm
            },
            data: {
                label: "Movies"
            }
        },
        route: "#/omomovies/movies"
    },
    {
        type: "route",
        pos: "4",
        mapping: {
            design: {
                icon: faUserCircle,
            },
            data: {
                label: "Home",
            }
        },
        route: "#/omoli/dapps"
    }
];
export const omomoviesOverflowActions = [
    {
        type: "trigger",
        pos: "overflow",
        mapping: {
            design: {
                icon: faCoins,
            },
            data: {
                label: "Suggest new movie",
            }
        },
    },
];
