import { faUserCircle, faUserAstronaut, faKey, faCoins, faUsers } from "@fortawesome/free-solid-svg-icons";
import { RunProcess } from "../../../libs/o-events/runProcess";
import { createOmoSapien } from "../processes/createOmoSapien/createOmoSapien";
import { QuickAction } from "../../../libs/o-os/types/quickAction";
import { updateOmoSapien } from "../processes/updateOmoSapien/updateOmoSapien";

export const omoSapienDefaultActions: QuickAction[] = [
  {
    type: "route",
    pos: "1",
    mapping: {
      design: {
        icon: faUserAstronaut
      },
      data: {
        label: "Me"
      }
    },
    route: "#/omosapien/me"
  }, {
    type: "route",
    pos: "2",
    mapping: {
      design: {
        icon: faUsers,
      },
      data: {
        label: "Profiles"
      }
    },
    route: "#/omosapien/profiles"
  }, {
    type: "route",
    pos: "3",
    mapping: {
      design: {
        icon: faKey,
      },
      data: {
        label: "Keys",
      }
    },
    route: "#/omosapien/keys"
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

export const omoSapienOverflowActions: QuickAction[] = [{
  type: "trigger",
  pos: "overflow",
  mapping: {
    design: {
      icon: faCoins,
    },
    data: {
      label: "Update Profile",
    }
  },
  event: () => new RunProcess(updateOmoSapien)
},
];
