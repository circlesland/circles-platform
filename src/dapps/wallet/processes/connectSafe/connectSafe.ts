import { assign, createMachine } from "xstate";
import { ProcessContext } from "src/libs/o-processes/processContext";
import { ProcessEvent } from "src/libs/o-processes/processEvent";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { Address } from "../../../../libs/o-circles-protocol/interfaces/address";
import { ByteString } from "../../../../libs/o-circles-protocol/interfaces/byteString";
import { promptSuccess } from "../promptSuccess";
import { promptError } from "../promptError";
import { connectSafeService } from "./services/connectSafeService";
import { notifyInProgress } from "./actions/notifyInProgress";
import { promptSafeAddress } from "./actions/promptSafeAddress";
import { promptPrivateKey } from "./actions/promptPrivateKey";
import { summarize } from "./actions/summarize";
import { storePrivateKeyToContext } from "./actions/storePrivateKeyToContext";
import { storeSafeAddressToContext } from "./actions/storeSafeAddressToContext";
import { strings } from "../../data/strings";

import { push } from "svelte-spa-router";

export interface ConnectSafeContext extends ProcessContext {
    connectSafe?: {
        safeAddress?: {
            type: "ethereumAddress",
            data: Address
        },
        safeOwnerAddress?: {
            type: "ethereumAddress",
            data: Address
        },
        safeOwnerPrivateKey?: {
            type: "bytestring",
            data: ByteString
        }
    }
}

/**
 * Connect safe
 */
const processDefinition = createMachine<ConnectSafeContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": "promptSafeAddress",
                "omo.cancel": "stop"
            }
        },
        promptSafeAddress: {
            entry: "promptSafeAddress",
            on: {
                "omo.answer": {
                    actions: "storeSafeAddressToContext",
                    target: "promptPrivateKey"
                },
                "omo.trigger": {
                    actions: "promptSafeAddress"
                },
                "omo.cancel": "stop"
            }
        },
        promptPrivateKey: {
            entry: "promptPrivateKey",
            on: {
                "omo.back": {
                    target: "promptSafeAddress"
                },
                "omo.answer": {
                    actions: "storePrivateKeyToContext",
                    target: "summarize"
                },
                "omo.trigger": {
                    actions: "promptPrivateKey"
                },
                "omo.cancel": "stop"
            }
        },
        summarize: {
            entry: "summarize",
            on: {
                "omo.back": {
                    target: "promptPrivateKey"
                },
                "omo.answer": {
                    target: "connectSafe"
                },
                "omo.trigger": {
                    actions: "summarize"
                },
                "omo.cancel": "stop"
            }
        },
        connectSafe: {
            entry: "notifyInProgress",
            invoke: {
                id: 'connectSafe',
                src: "connectSafeService",
                onError: {
                    actions: [
                        "setError",
                        "promptError"
                    ],
                    target: "error"
                },
                onDone: {
                    actions: [
                        "setResult",
                        "promptSuccess",
                        () => push('#/wallet/safe'),
                    ],
                    target: "success"
                }
            }
        },
        success: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop",
                "omo.trigger": {
                    //actions: "promptSuccess"
                }
            }
        },
        error: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: "promptError"
                }
            }
        },
        stop: {
            type: "final"
        }
    }
}, {
    services: {
        "connectSafeService": connectSafeService
    },
    guards: {},
    actions: {
        "setError": assign(
            context => {
                context.result = strings.wallet.processes.connectSafe.errorMessage(context)
                return context;
            }),
        "setResult": assign(
            context => {
                context.result = strings.wallet.processes.connectSafe.successMessage(context)
                return context;
            }),
        "notifyInProgress": notifyInProgress,
        "promptError": promptError,
        "promptSuccess": promptSuccess,
        "promptSafeAddress": promptSafeAddress,
        "promptPrivateKey": promptPrivateKey,
        "summarize": summarize,
        "storePrivateKeyToContext": storePrivateKeyToContext,
        "storeSafeAddressToContext": storeSafeAddressToContext
    }
});

export const connectSafe: ProcessDefinition = {
    name: "connectSafe",
    stateMachine: processDefinition
};
