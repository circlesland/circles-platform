import { faUserCircle, faCoins, faStore} from "@fortawesome/free-solid-svg-icons";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";

export const omofundingDefaultActions: QuickAction[] = [
  {
    type: "route",
    pos: "1",
    mapping: {
      design: {
        icon: faStore
      },
      data: {
        label: "Projects"
      }
    },
    route: "#/omofunding/featured"
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

export const omofundingOverflowActions: QuickAction[] = [

  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins,
      },
      data: {
        label: "Create new funding project",
      }
    },
    // event: () => new RunProcess(createNew)
  },
];
