import { faCoins, faUserCircle, faPiggyBank, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import {requestUbi} from "../processes/circles/requestUbi";
import {transferCircles} from "../processes/circles/transferCircles";
import {setTrust, SetTrustContext} from "../processes/circles/setTrust";
import {sendInviteCredits} from "../processes/omo/sendInviteCredits";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
import {RunProcess} from "omo-process/dist/events/runProcess";

export const safeDefaultActions: QuickAction[] = [
{
    type: "route",
    pos: "1",
    mapping: {
      design: {
        icon: faPiggyBank
      },
      data: {
        label: "Safe"
      }
    },
    route: "#/safe/transactions"
  }, {
    type: "route",
    pos: "2",
    mapping: {
      design: {
        icon: faCoins,
      },
      data: {
        label: "Tokens"
      }
    },
    route: "#/safe/tokens"
  }, {
    type: "route",
    pos: "3",
    mapping: {
      design: {
        icon: faUserFriends,
      },
      data: {
        label: "Friends",
      }
    },
    route: "#/safe/friends"
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

export const safeOverflowActions = [
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins
      },
      data: {
        label: "Harvest new time"
      }
    },
    event: () => new RunProcess(requestUbi)
  },
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins
      },
      data: {
        label: "Send Invite Credits"
      }
    },
    event: () => new RunProcess(sendInviteCredits)
  },
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins
      },
      data: {
        label: "Send ⦿"
      }
    },
    event: () => new RunProcess(transferCircles)
  },
  {
    type: "trigger",
    pos: "overflow",
    mapping: {
      design: {
        icon: faCoins,
      },
      data: {
        label: "Add friend",
      }
    },
    event: () => new RunProcess(setTrust, (context: SetTrustContext) => {
      return Promise.resolve(context);
    })
  },

];
