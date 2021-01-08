var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { omosafe } from "../../dapps/safe/manifest";
import { omoli } from "../../dapps/omoli/manifest";
import { omosapien } from "../../dapps/omosapien/manifest";
import { omowebsite } from "../../dapps/website/manifest";
import { omomarket } from "../../dapps/omomarket/manifest";
import { omofunding } from "../../dapps/omofunding/manifest";
import { omomovies } from "../../dapps/omomovies/manifest";
import { fissiondrive } from "../../dapps/fissiondrive/manifest";
import { fissionauth } from "../../dapps/fissionauth/manifest";
import { omotalk } from "../../dapps/omotalk/manifest";
import { omomusic } from "../../dapps/omomusic/manifest";
import { omobooks } from "../../dapps/omobooks/manifest";
import { EventBroker } from "./eventBroker";
import { shellEvents } from "./shellEvents";
import LoadingIndicator from 'src/libs/o-views/atoms/LoadingIndicator.svelte';
import ErrorIndicator from 'src/libs/o-views/atoms/ErrorIndicator.svelte';
import NotFound from 'src/libs/o-views/pages/NotFound.svelte';
import wrap from "svelte-spa-router/wrap";
import { waitingarea } from "../../dapps/waitingarea/manifest";
const errorIndicator = ErrorIndicator;
export const dapps = [
    omosapien,
    omosafe,
    omomarket,
    omofunding,
    fissiondrive,
    fissionauth,
    omotalk,
    omomovies,
    omomusic,
    omobooks,
    omoli,
    omowebsite,
    waitingarea
];
export const loadedDapps = [];
export const dappStates = {};
export function tryGetDappState(dappId) {
    const state = dappStates[dappId];
    if (!state)
        return null;
    return state;
}
export function setDappState(dappId, setter) {
    const state = dappStates[dappId];
    dappStates[dappId] = setter(state);
}
export function constructAppUrl(dappManifest) {
    var _a, _b;
    const appBaseUrl = dappManifest.routeParts.reduce((p, c) => p + "/" + c, "");
    const appDefaultPage = (_a = dappManifest.pages.find(o => o.isDefault)) !== null && _a !== void 0 ? _a : dappManifest.pages[0];
    const appDefaultRoute = (_b = appDefaultPage === null || appDefaultPage === void 0 ? void 0 : appDefaultPage.routeParts.reduce((p, c) => p + "/" + c, appBaseUrl)) !== null && _b !== void 0 ? _b : appBaseUrl;
    return { appBaseUrl, appDefaultRoute };
}
function constructPageUrl(appBaseUrl, pageManifest) {
    let pageUrl = pageManifest.routeParts.reduce((p, c) => p + "/" + c, appBaseUrl);
    if (pageUrl == "")
        pageUrl = "/";
    return pageUrl;
}
function getDappEntryPoint(dappManifest, pageManifest) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let runtimeDapp = loadedDapps.find(o => o.id == dappManifest.id);
            if (!runtimeDapp) {
                // The dapp isn't yet loaded
                const freshRuntimeDapp = yield loadDapp([], dappManifest);
                if (freshRuntimeDapp.cancelDependencyLoading) {
                    window.o.logger.log("A dependency requested the cancellation of the dependency loading process.");
                    if (!freshRuntimeDapp.initialPage) {
                        // TODO: Every dapp needs a initial page for all conditions, else the generic loader error is displayed
                        throw new Error("The dapp '" + freshRuntimeDapp.runtimeDapp.id + "' has no 'initialPage' attribute or its value is null.");
                    }
                    return freshRuntimeDapp.initialPage.component;
                }
                else {
                    loadedDapps.push(freshRuntimeDapp.runtimeDapp);
                }
            }
            return pageManifest.component;
        }
        catch (e) {
            window.o.lastError = e;
            return errorIndicator;
        }
    });
}
function constructRoutes(dappManifests) {
    const routes = {};
    dappManifests.forEach(dappManifest => {
        const appUrls = constructAppUrl(dappManifest);
        dappManifest.pages.forEach(pageManifest => {
            const pageUrl = constructPageUrl(appUrls.appBaseUrl, pageManifest);
            routes[pageUrl] = wrap({
                loadingComponent: LoadingIndicator,
                userData: pageManifest.userData,
                asyncComponent: () => __awaiter(this, void 0, void 0, function* () { return yield getDappEntryPoint(dappManifest, pageManifest); })
            });
        });
    });
    routes["*"] = wrap({
        component: NotFound
    });
    return routes;
}
export const dappEvents = new EventBroker();
function createDappTopics(runtimeDapp) {
    const inTopic = dappEvents.createTopic(runtimeDapp.id, "in");
    const outTopic = dappEvents.createTopic(runtimeDapp.id, "in");
    return Object.assign(Object.assign({}, runtimeDapp), { shellEvents: shellEvents, inEvents: inTopic, outEvents: outTopic });
}
function initializeDapp(stack, runtimeDapp) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const logPrefix = "  ".repeat(stack.length) + "initializeDapp(" + runtimeDapp.id + "): ";
        let cancelled = false;
        let defaultPage = null;
        // first check if all dependencies are fulfilled
        if (runtimeDapp.dependencies) {
            window.o.logger.log(logPrefix + "Initializing " + runtimeDapp.dependencies.length + " dependencies ...");
            const missingDependencies = runtimeDapp.dependencies.filter(dep => !loadedDapps.find(o => o.id == dep));
            if (missingDependencies.length == 0) {
                // All dependencies are already loaded
                window.o.logger.log(logPrefix + "All dependencies are already loaded");
            }
            else {
                // Some or all dependencies need to be loaded
                window.o.logger.log(logPrefix + "Some or all dependencies must be loaded before proceeding");
                const nextStack = [...stack, runtimeDapp];
                yield Promise.all(missingDependencies.map((dep) => __awaiter(this, void 0, void 0, function* () {
                    if (cancelled) {
                        return;
                    }
                    const dappManifest = dapps.find(o => o.id == dep);
                    if (!dappManifest) {
                        throw new Error(logPrefix + "Couldn't find the manifest for dapp '" + dep + "' (Dependency of '" + runtimeDapp.id + "')");
                    }
                    const loadDappResult = yield loadDapp(nextStack, dappManifest);
                    if (loadDappResult.cancelDependencyLoading) {
                        window.o.logger.log(logPrefix + "Loading sequence was cancelled by " + dep + " in " + runtimeDapp.id);
                        cancelled = true;
                        if (loadDappResult.initialPage) {
                            defaultPage = loadDappResult.initialPage;
                        }
                    }
                })));
                if (cancelled) {
                    window.o.logger.log(logPrefix + "Loading sequence was cancelled in " + runtimeDapp.id);
                    return {
                        runtimeDapp,
                        cancelDependencyLoading: true,
                        initialPage: defaultPage
                    };
                }
                else {
                    window.o.logger.log(logPrefix + "Loaded all dependencies of " + runtimeDapp.id);
                }
            }
        }
        if (!cancelled) {
            defaultPage = (_a = runtimeDapp.pages.find(o => o.isDefault)) !== null && _a !== void 0 ? _a : runtimeDapp.pages[0];
        }
        let initializationResult = {
            initialPage: defaultPage,
            cancelDependencyLoading: cancelled
        };
        if (runtimeDapp.initialize) {
            initializationResult = yield runtimeDapp.initialize(stack, runtimeDapp);
            window.o.logger.log("initializedDappState", initializationResult);
        }
        return {
            runtimeDapp,
            cancelDependencyLoading: initializationResult.cancelDependencyLoading,
            initialPage: initializationResult.initialPage
        };
    });
}
function loadDapp(stack, dappManifest) {
    return __awaiter(this, void 0, void 0, function* () {
        const { appBaseUrl, appDefaultRoute } = constructAppUrl(dappManifest);
        let runtimeDapp = Object.assign(Object.assign({}, dappManifest), { route: appDefaultRoute, shell: window.o, runtimePages: dappManifest.pages.map(pageManifest => {
                const pageUrl = constructPageUrl(appBaseUrl, pageManifest);
                return Object.assign(Object.assign({}, pageManifest), { route: pageUrl });
            }) });
        runtimeDapp = createDappTopics(runtimeDapp);
        return yield initializeDapp(stack, runtimeDapp);
    });
}
const routes = constructRoutes(dapps);
console.log("Registered the following routes: ", routes);
export default routes;
