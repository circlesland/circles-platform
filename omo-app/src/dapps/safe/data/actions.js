import { faCoins, faUserCircle, faPiggyBank, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { RunProcess } from "src/libs/o-events/runProcess";
import { requestUbi } from "../processes/circles/requestUbi";
import { transferCircles } from "../processes/circles/transferCircles";
import { setTrust } from "../processes/circles/setTrust";
import { sendInviteCredits } from "../processes/omo/sendInviteCredits";
export const safeDefaultActions = [
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
        event: () => new RunProcess(setTrust, (context) => {
            return Promise.resolve(context);
        })
    },
];
