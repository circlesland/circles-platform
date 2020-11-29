import { faUserCircle, faUserAstronaut, faLock, faKey, faCoins } from "@fortawesome/free-solid-svg-icons";
import { ActionBarAction } from "src/libs/o-os/routes";
import {RunProcess} from "../../../libs/o-events/runProcess";
import {requestUbi} from "../../safe/processes/requestUbi/requestUbi";
import {createOdentity} from "../processes/createOdentity/createOdentity";

export const odentityDefaultActions: ActionBarAction[] = [
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

export const odentityOverflowActions: ActionBarAction[] = [
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
