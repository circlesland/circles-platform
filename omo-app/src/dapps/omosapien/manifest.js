var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Me from 'src/dapps/omosapien/views/pages/Me.svelte';
import Profiles from 'src/dapps/omosapien/views/pages/Profiles.svelte';
import Keys from 'src/dapps/omosapien/views/pages/Keys.svelte';
import NoProfile from 'src/dapps/omosapien/views/pages/NoProfile.svelte';
import { omoSapienDefaultActions, omoSapienOverflowActions } from "./data/actions";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { RunProcess } from "../../libs/o-events/runProcess";
import { createOmoSapien } from "./processes/createOmoSapien/createOmoSapien";
import { setDappState, tryGetDappState } from "../../libs/o-os/loader";
import { runWithDrive } from "../../libs/o-fission/initFission";
function tryInitMyProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        yield runWithDrive((fissionDrive) => __awaiter(this, void 0, void 0, function* () {
            const myProfile = yield fissionDrive.profiles.tryGetMyProfile();
            setDappState("omo.sapien:1", currentState => {
                return Object.assign(Object.assign({}, currentState), { myProfile: myProfile });
            });
        }));
    });
}
function tryInitOmoDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        const cid = yield fetch("https://directory.omo.earth/directory");
        try {
            const directory = yield (yield fetch("https://ipfs.io/ipfs/" + (yield cid.text()))).json();
            const lookupDirectory = {
                byFissionName: directory,
                byCirclesSafe: {}
            };
            Object.values(directory).forEach((o) => {
                if (!o.circlesSafe) {
                    return;
                }
                lookupDirectory.byCirclesSafe[o.circlesSafe] = o;
            });
            const omosapienState = tryGetDappState("omo.sapien:1");
            omosapienState.directory = lookupDirectory;
            // Check if the directory includes myself and, if not add me.
            // This is necessary because at the time of the profile creation or update
            // the DNSLink still updates.
            const fissionAuthState = tryGetDappState("omo.fission.auth:1");
            const myDirectoryEntry = omosapienState.directory.byFissionName[fissionAuthState.username];
            const isRegistrationCorrect = myDirectoryEntry
                && myDirectoryEntry.firstName == omosapienState.myProfile.firstName
                && myDirectoryEntry.lastName == omosapienState.myProfile.lastName
                && myDirectoryEntry.circlesSafe == omosapienState.myProfile.circlesAddress;
            if (!isRegistrationCorrect) {
                window.o.logger.log("You're not registered at the global directory yet or your registration is outdated. Updating it now ...");
                yield fetch("https://directory.omo.earth/signup/" + fissionAuthState.username, {
                    method: "POST"
                });
                window.o.logger.log("You're not registered at the global directory yet or your registration is outdated. Updating it now ... Done");
            }
        }
        catch (e) {
            console.warn(e);
        }
    });
}
const noProfilePage = {
    isDefault: true,
    routeParts: ["no-profile"],
    component: NoProfile,
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
            ...omoSapienDefaultActions,
            ...omoSapienOverflowActions
        ]
    }
};
/**
 * Checks if the user already has a profile.
 * If not, starts the process to create a new Omosapien and cancels the loading.
 * @param stack
 * @param runtimeDapp
 */
function initialize(stack, runtimeDapp) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tryInitMyProfile();
        const omosapienState = tryGetDappState("omo.sapien:1");
        if (!omosapienState.myProfile) {
            runtimeDapp.shell.publishEvent(new RunProcess(createOmoSapien));
            return {
                cancelDependencyLoading: true,
                initialPage: noProfilePage
            };
        }
        yield tryInitOmoDirectory();
        return {
            cancelDependencyLoading: false,
            initialPage: null
        };
    });
}
export const omosapien = {
    id: "omo.sapien:1",
    dependencies: ["omo.fission.auth:1"],
    icon: faUserAstronaut,
    title: "OmoSapien",
    routeParts: ["omosapien"],
    tag: Promise.resolve("alpha"),
    isEnabled: true,
    initialize: initialize,
    pages: [{
            isDefault: true,
            routeParts: ["me"],
            component: Me,
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
                    ...omoSapienDefaultActions,
                    ...omoSapienOverflowActions
                ]
            }
        }, {
            routeParts: ["profiles"],
            component: Profiles,
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
                    ...omoSapienDefaultActions,
                    ...omoSapienOverflowActions
                ]
            }
        }, {
            routeParts: ["keys"],
            component: Keys,
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
                    ...omoSapienDefaultActions,
                    ...omoSapienOverflowActions
                ]
            }
        }]
};
