import Profile from 'src/dapps/odentity/views/pages/Profile.svelte'
import Access from 'src/dapps/odentity/views/pages/Access.svelte'
import Keys from 'src/dapps/odentity/views/pages/Keys.svelte'

import { faUserCircle, faUserAstronaut, faLock, faKey } from "@fortawesome/free-solid-svg-icons";
import { ActionBarAction } from 'src/libs/o-os/routes';


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

export const profile = {
    component: Profile,
    userData: {
        actions: <ActionBarAction[]>[
            ...odentityDefaultActions
        ]
    }
}

export const access = {
    component: Access,
    userData: {
        actions: <ActionBarAction[]>[
            ...odentityDefaultActions
        ]
    }
}

export const keys = {
    component: Keys,
    userData: {
        actions: <ActionBarAction[]>[
            ...odentityDefaultActions
        ]
    }
}