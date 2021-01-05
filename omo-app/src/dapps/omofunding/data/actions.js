import { faUserCircle, faCoins, faStore } from "@fortawesome/free-solid-svg-icons";
export const omofundingDefaultActions = [
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
export const omofundingOverflowActions = [
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
    },
];
