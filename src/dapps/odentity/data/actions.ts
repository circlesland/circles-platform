import { faUserCircle, faUserAstronaut, faLock, faKey } from "@fortawesome/free-solid-svg-icons";

export const odentityDefaultActions = [
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