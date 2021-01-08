var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Dapps from 'src/dapps/omoli/views/pages/Dapps.svelte';
import { faBoxes, faCoins } from "@fortawesome/free-solid-svg-icons";
import { tryGetDappState } from "../../libs/o-os/loader";
const dappsPage = {
    isDefault: true,
    routeParts: ["dapps"],
    component: Dapps,
    available: [
        (detail) => {
            window.o.logger.log("routeGuard.detail:", detail);
            const fissionAuthState = tryGetDappState("omo.fission.auth:1");
            return fissionAuthState.fission !== undefined;
        }
    ],
    userData: {
        showActionBar: false,
        actions: [{
                type: "trigger",
                pos: "overflow",
                mapping: {
                    design: {
                        icon: faCoins,
                    },
                    data: {
                        label: "Connect Circles Safe"
                    }
                },
            }]
    }
};
export const omoli = {
    id: "omo.li:1",
    dependencies: ["omo.sapien:1"],
    isHidden: true,
    icon: faBoxes,
    title: "Dapps",
    routeParts: ["omoli"],
    tag: Promise.resolve("mockup"),
    isEnabled: true,
    initialize: (stack, runtimeDapp) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            // TODO: Change the initialPage
            initialPage: dappsPage,
            cancelDependencyLoading: false
        };
    }),
    pages: [dappsPage]
};
