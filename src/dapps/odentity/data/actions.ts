import { faUserCircle, faUserAstronaut, faLock, faKey, faCoins } from "@fortawesome/free-solid-svg-icons";
import {RunProcess} from "../../../libs/o-events/runProcess";
import {createOdentity} from "../processes/createOdentity/createOdentity";
import {QuickAction} from "../../../libs/o-os/types/quickAction";

export const odentityDefaultActions: QuickAction[] = [
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
        route: "#/odentity/profile"
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
        route: "#/odentity/access"
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
        route: "#/odentity/keys"
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

export const odentityOverflowActions: QuickAction[] = [
    {
        type: "trigger",
        pos: "overflow",
        mapping: {
            design: {
                icon: faCoins
            },
            data: {
                label: "Add new access device"
            }
        },
    },
    {
        type: "trigger",
        pos: "overflow",
        mapping: {
            design: {
                icon: faCoins,
            },
            data: {
                label: "Remove access device",
            }
        },
    },
    {
        type: "trigger",
        pos: "overflow",
        mapping: {
            design: {
                icon: faCoins,
            },
            data: {
                label: "Create odentity",
            }
        },
        event: () => new RunProcess(createOdentity)
    },
];
