var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AnswerInviteRequest from "./views/pages/AnswerInviteRequest.svelte";
import Transactions from "./views/pages/Transactions.svelte";
import Friends from "./views/pages/Friends.svelte";
import Tokens from "./views/pages/Tokens.svelte";
import NoFunds from "./views/pages/NoFunds.svelte";
import NoKey from "./views/pages/NoKey.svelte";
import NoSafe from "./views/pages/NoSafe.svelte";
import NoToken from "./views/pages/NoToken.svelte";
import { safeDefaultActions, safeOverflowActions } from "./data/actions";
import { RunProcess } from "../../libs/o-events/runProcess";
import { faCheck, faPiggyBank, faTimes } from "@fortawesome/free-solid-svg-icons";
import { CloseModal } from "../../libs/o-events/closeModal";
import { push } from "svelte-spa-router";
import { tryGetDappState } from "../../libs/o-os/loader";
import { BN } from "ethereumjs-util";
import { sendInviteCredits } from "./processes/omo/sendInviteCredits";
import { deploySafe } from "./processes/safe/deploySafe";
import { initMyKey } from "./init/myKey";
import { initXDaiBalances } from "./init/xDaiBalances";
import { initMyContacts } from "./init/myContacts";
import { initMyKnownTokens } from "./init/myKnownTokens";
import { initMyTransactions } from "./init/myTransactions";
import { initSafeAddress } from "./init/safeAddress";
import { initMyToken } from "./init/myToken";
import { initMyBalances } from "./init/myBalances";
import { initialMenu } from "./processes/menus/initialMenu";
import { fundAccountForSafeCreation } from "./processes/omo/fundAccountForSafeCreation";
import { signupAtCircles } from "./processes/omo/signupAtCircles";
import { BeginSignal, ProgressSignal } from "../../libs/o-circles-protocol/interfaces/blockchainEvent";
const transactionPage = {
    isDefault: true,
    routeParts: ["transactions"],
    component: Transactions,
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
            ...safeDefaultActions,
            ...safeOverflowActions
        ]
    }
};
const noFundsPage = {
    isDefault: true,
    routeParts: ["no-funds"],
    component: NoFunds,
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
            ...safeDefaultActions,
            ...safeOverflowActions
        ]
    }
};
const noKeyPage = {
    isDefault: true,
    routeParts: ["no-key"],
    component: NoKey,
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
            ...safeDefaultActions,
            ...safeOverflowActions
        ]
    }
};
const noSafePage = {
    isDefault: true,
    routeParts: ["no-safe"],
    component: NoSafe,
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
            ...safeDefaultActions,
            ...safeOverflowActions
        ]
    }
};
const noTokenPage = {
    isDefault: true,
    routeParts: ["no-token"],
    component: NoToken,
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
            ...safeDefaultActions,
            ...safeOverflowActions
        ]
    }
};
let safeManifestLogger;
/**
 * Checks if the omosapien has a private  key in its storage.
 * If the user doesn't have a private key, he's prompted to either
 * import one or to create a new one.
 * @param stack
 * @param runtimeDapp
 */
function initialize(stack, runtimeDapp) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        safeManifestLogger = window.o.logger.newLogger(`initialize()`);
        safeManifestLogger.log("begin");
        window.o.publishEvent(new BeginSignal("omo.safe:1:initialize"));
        window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your safe key ..", 0));
        yield initMyKey();
        let safeState = tryGetDappState("omo.safe:1");
        if (!safeState.myKey) {
            // Safe not connected
            window.o.publishEvent(new RunProcess(initialMenu));
            return {
                cancelDependencyLoading: true,
                initialPage: noKeyPage,
                dappState: null
            };
        }
        window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your safe address ..", 0));
        yield initSafeAddress();
        window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your xDai balances ..", 0));
        yield initXDaiBalances();
        safeState = tryGetDappState("omo.safe:1");
        if (!safeState.mySafeAddress
            && ((_b = (_a = safeState.myAccountXDaiBalance) === null || _a === void 0 ? void 0 : _a.lt(new BN("100000"))) !== null && _b !== void 0 ? _b : true)) {
            // Got an account but no funding to deploy a safe
            window.o.publishEvent(new RunProcess(fundAccountForSafeCreation));
            return {
                cancelDependencyLoading: true,
                initialPage: noFundsPage,
                dappState: null
            };
        }
        if (!safeState.mySafeAddress
            && ((_d = (_c = safeState.myAccountXDaiBalance) === null || _c === void 0 ? void 0 : _c.gte(new BN("100000"))) !== null && _d !== void 0 ? _d : false)) {
            // Got a funded account, ready to deploy the safe
            window.o.publishEvent(new RunProcess(deploySafe));
            return {
                cancelDependencyLoading: true,
                initialPage: noSafePage,
                dappState: null
            };
        }
        window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your token ..", 0));
        yield initMyToken();
        safeState = tryGetDappState("omo.safe:1");
        if (safeState.mySafeAddress && !safeState.myToken) {
            // Not yet registered at the circles hub
            runtimeDapp.shell.publishEvent(new RunProcess(signupAtCircles));
            return {
                cancelDependencyLoading: true,
                initialPage: noTokenPage
            };
        }
        window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your contacts ..", 0));
        yield initMyContacts();
        window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your contacts' tokens ..", 0));
        yield initMyKnownTokens();
        window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your transactions ..", 0));
        yield initMyTransactions(safeManifestLogger);
        window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your balances ..", 0));
        yield initMyBalances();
        return {
            cancelDependencyLoading: false,
            initialPage: transactionPage,
            dappState: null
        };
        safeManifestLogger.log("end");
    });
}
export const omosafe = {
    id: "omo.safe:1",
    dependencies: ["omo.sapien:1"],
    icon: faPiggyBank,
    title: "OmoSafe",
    routeParts: ["safe"],
    tag: Promise.resolve("alpha"),
    isEnabled: true,
    initialize: initialize,
    pages: [{
            routeParts: ["empowerMe", ":from", ":name"],
            component: AnswerInviteRequest,
            available: [
                (detail) => {
                    window.o.logger.log("Starting answer invite process ..", detail);
                    return true;
                }
            ],
            userData: {
                showActionBar: true,
                actions: [
                    ...safeDefaultActions,
                    ...[{
                            type: "trigger",
                            pos: "overflow",
                            mapping: {
                                design: {
                                    icon: faCheck
                                },
                                data: {
                                    label: "Jumpstart " + "0x1234..."
                                }
                            },
                            event: () => new RunProcess(sendInviteCredits, (context) => __awaiter(void 0, void 0, void 0, function* () {
                                context.data.recipient = {
                                    key: "recipient",
                                    value: "",
                                    isReadonly: true
                                };
                                return context;
                            }))
                        }, {
                            type: "trigger",
                            pos: "overflow",
                            mapping: {
                                design: {
                                    icon: faTimes
                                },
                                data: {
                                    label: "Cancel"
                                }
                            },
                            event: () => {
                                push("#/safe/transactions");
                                window.o.publishEvent(new CloseModal());
                            }
                        }]
                ]
            }
        }, transactionPage, {
            routeParts: ["friends"],
            component: Friends,
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
                    ...safeDefaultActions,
                    ...safeOverflowActions
                ]
            }
        }, {
            routeParts: ["tokens"],
            component: Tokens,
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
                    ...safeDefaultActions,
                    ...safeOverflowActions
                ]
            }
        }]
};
