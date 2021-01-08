import Offers from 'src/dapps/omomarket/views/pages/Offers.svelte';
import Requests from 'src/dapps/omomarket/views/pages/Requests.svelte';
import Favorites from 'src/dapps/omomarket/views/pages/Favorites.svelte';
import { omomarketDefaultActions, omomarketOverflowActions } from './data/actions';
import { faPeopleCarry } from "@fortawesome/free-solid-svg-icons";
import { tryGetDappState } from "../../libs/o-os/loader";
export const omomarket = {
    id: "omo.market:1",
    dependencies: ["omo.sapien:1"],
    icon: faPeopleCarry,
    title: "OmoMarket",
    routeParts: ["omomarket"],
    tag: Promise.resolve("mockup"),
    isEnabled: true,
    pages: [{
            isDefault: true,
            routeParts: ["offers"],
            component: Offers,
            available: [
                (detail) => {
                    window.o.logger.log("routeGuard.detail:", detail);
                    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
                    return fissionAuthState.fission !== undefined;
                }
            ],
            userData: {
                showActionBar: true,
                actions: [
                    ...omomarketDefaultActions,
                    ...omomarketOverflowActions
                ]
            }
        }, {
            routeParts: ["requests"],
            component: Requests,
            available: [
                (detail) => {
                    window.o.logger.log("routeGuard.detail:", detail);
                    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
                    return fissionAuthState.fission !== undefined;
                }
            ],
            userData: {
                showActionBar: true,
                actions: [
                    ...omomarketDefaultActions,
                    ...omomarketOverflowActions
                ]
            }
        }, {
            routeParts: ["favorites"],
            component: Favorites,
            available: [
                (detail) => {
                    window.o.logger.log("routeGuard.detail:", detail);
                    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
                    return fissionAuthState.fission !== undefined;
                }
            ],
            userData: {
                showActionBar: true,
                actions: [
                    ...omomarketDefaultActions,
                    ...omomarketOverflowActions
                ]
            }
        }]
};
