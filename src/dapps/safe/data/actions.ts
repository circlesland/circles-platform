import { setTrust, SetTrustContext } from "./../processes/setTrust/setTrust";
import { requestUbi } from "./../processes/requestUbi/requestUbi";
import { transferCircles } from "./../processes/transferCircles/transferCircles";
import { transferXDai } from "./../processes/transferXDai/transferXDai";

import { faCoins, faUserCircle, faPiggyBank, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { RunProcess } from "src/libs/o-events/runProcess";

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
        route: "#/omo/dapps"
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
                label: "Get UBI"
            }
        },
        event: () => new RunProcess(requestUbi)
    },
    // {
    //     type: "trigger",
    //     pos: "overflow",
    //     mapping: {
    //         design: {
    //             icon: faCoins
    //         },
    //         data: {
    //             label: "Send xDai"
    //         }
    //     },
    //     event: () => new RunProcess(transferXDai)
    // },
    {
        type: "trigger",
        pos: "overflow",
        mapping: {
            design: {
                icon: faCoins,
            },
            data: {
                label: "Trust friend",
            }
        },
        event: () => new RunProcess(setTrust, (context: SetTrustContext) => {
            context.setTrust = { trustLimit: { type: 'percent', data: 100 } };
            return context;
        })
    },
    // {
    //     type: "trigger",
    //     pos: "overflow",
    //     mapping: {
    //         design: {
    //             icon: faCoins
    //         },
    //         data: {
    //             label: "Send Money"
    //         }
    //     },
    //     event: () => new RunProcess(transferCircles)
    // }, {
    //     type: "trigger",
    //     pos: "overflow",
    //     mapping: {
    //         design: {
    //             icon: faCoins
    //         },
    //         data: {
    //             label: "Receive Money"
    //         }
    //     },
    // }
];