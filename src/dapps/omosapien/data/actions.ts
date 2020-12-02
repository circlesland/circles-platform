import { faUserCircle, faUserAstronaut, faLock, faKey, faCoins } from "@fortawesome/free-solid-svg-icons";
import { RunProcess } from "../../../libs/o-events/runProcess";
import { createOmoSapien } from "../processes/createOmoSapien/createOmoSapien";
import { QuickAction } from "../../../libs/o-os/types/quickAction";

export const omoSapienDefaultActions: QuickAction[] = [
    {
        type: "route",
        pos: "1",
        mapping: {
            design: {
                icon: faUserAstronaut
            },
            data: {
                label: "Profile"
            }
        },
        route: "#/omosapien/profile"
    }, {
        type: "route",
        pos: "2",
        mapping: {
            design: {
                icon: faLock,
            },
            data: {
                label: "Access"
            }
        },
        route: "#/omosapien/access"
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
        route: "#/omo/dapps"
    }
];

export const omoSapienOverflowActions: QuickAction[] = [

    {
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
        event: () => new RunProcess(createOmoSapien)
    },
];
