import { faUserCircle, faCoins, faStar, faStore, faDove } from "@fortawesome/free-solid-svg-icons";
import {createOffer} from "../processes/createOffer/createOffer";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
import {RunProcess} from "omo-process/dist/events/runProcess";

export const omomarketDefaultActions: QuickAction[] = [
  {
    type: "route",
    pos: "1",
    mapping: {
      design: {
        icon: faStore
      },
      data: {
        label: "Offers"
      }
    },
    route: "#/omomarket/offers"
  }, {
    type: "route",
    pos: "2",
    mapping: {
      design: {
        icon: faDove,
      },
      data: {
        label: "Requests"
      }
    },
    route: "#/omomarket/requests"
  }, {
    type: "route",
    pos: "3",
    mapping: {
      design: {
        icon: faStar,
      },
      data: {
        label: "Favorites",
      }
    },
    route: "#/omomarket/favorites"
  }, {
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

export const omomarketOverflowActions: QuickAction[] = [

  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins,
      },
      data: {
        label: "Create new Offer",
      }
    },
    event: () => new RunProcess(createOffer)
  },
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins,
      },
      data: {
        label: "Create new Request",
      }
    },
    // event: () => new RunProcess(createNew)
  },
];
