import { faUserCircle, faCoins, faFilm } from "@fortawesome/free-solid-svg-icons";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";

export const omomoviesDefaultActions: QuickAction[] = [
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

export const omomoviesOverflowActions: QuickAction[] = [
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
    // event: () => new RunProcess(createNew)
  },
];
