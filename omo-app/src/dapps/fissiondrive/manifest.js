import Drive from "./views/pages/Drive.svelte";
import { faSave, faUserCircle } from "@fortawesome/free-solid-svg-icons";
export const defaultActions = [
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
export const fissiondrive = {
    id: "omo.fission.drive:1",
    dependencies: ["omo.li:1"],
    isHidden: false,
    icon: faSave,
    title: "Fission Drive",
    routeParts: ["fissiondrive"],
    tag: Promise.resolve("beta"),
    isEnabled: true,
    pages: [{
            isDefault: true,
            routeParts: ["drive"],
            component: Drive,
            available: [],
            userData: {
                showActionBar: true,
                actions: [
                    ...defaultActions
                ]
            }
        }]
};
