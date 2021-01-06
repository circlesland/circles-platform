var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Website from 'src/dapps/website/views/pages/Website.svelte';
import Visionpaper from 'src/dapps/website/views/pages/Visionpaper.svelte';
import Privacy from 'src/dapps/website/views/pages/Privacy.svelte';
import TOS from 'src/dapps/website/views/pages/TOS.svelte';
import Attributions from 'src/dapps/website/views/pages/Attributions.svelte';
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { setDappState, tryGetDappState } from "../../libs/o-os/loader";
import { FissionDrive } from "../../libs/o-fission/fissionDrive";
const homepage = {
    isDefault: true,
    routeParts: [],
    component: Website,
    userData: {
        showActionBar: false,
        actions: []
    }
};
export const omowebsite = {
    id: "omo.website:1",
    dependencies: [],
    isHidden: true,
    icon: faGlobe,
    title: "Hompage",
    routeParts: [],
    tag: Promise.resolve(null),
    isEnabled: true,
    initialize: (stack, runtimeDapp) => __awaiter(void 0, void 0, void 0, function* () {
        const loggedOnUser = localStorage.getItem("fissionAuth");
        if (loggedOnUser) {
            const auth = JSON.parse(loggedOnUser);
            const fissionAuthState = tryGetDappState("omo.fission.auth:1");
            if (!fissionAuthState || !fissionAuthState.fission) {
                setDappState("omo.fission.auth:1", current => {
                    return {
                        username: auth.username,
                        fission: new FissionDrive(auth)
                    };
                });
            }
        }
        return {
            cancelDependencyLoading: false,
            initialPage: homepage
        };
    }),
    pages: [homepage, {
            routeParts: ["privacy"],
            component: Privacy,
            userData: {
                showActionBar: false,
                actions: []
            }
        }, {
            routeParts: ["tos"],
            component: TOS,
            userData: {
                showActionBar: false,
                actions: []
            }
        }, {
            routeParts: ["attributions"],
            component: Attributions,
            userData: {
                showActionBar: false,
                actions: []
            }
        }, {
            routeParts: ["visionpaper"],
            component: Visionpaper,
            userData: {
                showActionBar: false,
                actions: []
            }
        }]
};
