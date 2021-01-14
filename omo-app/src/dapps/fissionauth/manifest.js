var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Auth from "./pages/Auth.svelte";
import Authenticate from "./pages/Authenticate.svelte";
import { omoSapienDefaultActions, omoSapienOverflowActions } from "../omosapien/data/actions";
import { tryGetDappState } from "../../libs/o-os/loader";
let fissionAuthLogger;
/**
 * Checks if the user is authenticated and redirects him to the 'Authentication' page if not.
 * If the user is already authenticated, he is presented with the default page of this dapp.
 * @param stack
 * @param runtimeDapp
 */
function initialize(stack, runtimeDapp) {
    return __awaiter(this, void 0, void 0, function* () {
        fissionAuthLogger = window.o.logger.newLogger(runtimeDapp.id);
        const initLogger = fissionAuthLogger.newLogger(`initialize(stack:[${stack.length}], runtimeDapp:${runtimeDapp.id})`);
        initLogger.log("begin");
        const fissionAuthState = tryGetDappState("omo.fission.auth:1");
        if (fissionAuthState === null || fissionAuthState === void 0 ? void 0 : fissionAuthState.fissionState) {
            initLogger.log("end");
            return {
                cancelDependencyLoading: false,
                initialPage: authPage
            };
        }
        else {
            initLogger.log("Cancel dependency loading. The user is not authenticated.");
            if (stack.length == 0) {
                initLogger.log("Redirecting to runtime dapp route (after authentication): '" + runtimeDapp.route + "'");
                window.o.redirectTo = runtimeDapp.route;
            }
            else {
                initLogger.log("Redirecting to last route from stack (after authentication): '" + stack[0].route + "'");
                window.o.redirectTo = stack[0].route;
            }
            initLogger.log("end");
            return {
                cancelDependencyLoading: true,
                initialPage: authenticate
            };
        }
    });
}
const authenticate = {
    routeParts: ["authenticate", ":redirectTo?"],
    component: Authenticate,
    userData: {
        actions: [
            ...omoSapienDefaultActions,
            ...omoSapienOverflowActions
        ]
    }
};
const authPage = {
    isDefault: true,
    routeParts: ["auth"],
    component: Auth,
    available: []
};
export const fissionauth = {
    id: "omo.fission.auth:1",
    dependencies: [],
    isHidden: true,
    isEnabled: false,
    icon: faCheckCircle,
    title: "Fission Auth",
    routeParts: ["fissionauth"],
    tag: Promise.resolve("beta"),
    initialize: initialize,
    pages: [
        authenticate,
        authPage
    ]
};
