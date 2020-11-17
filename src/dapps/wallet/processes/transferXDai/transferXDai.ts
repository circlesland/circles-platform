import {assign, createMachine} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {BN} from "ethereumjs-util";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {transferXDaiService} from "./services/transferXDaiService";
import {promptError} from "../promptError";
import {promptSuccess} from "../promptSuccess";
import {notifyInProgress} from "./actions/notifyInProgress";
import {isTransferPreconfigured} from "./guards/isTransferPreconfigured";
import {storeTransferRecipientToContext} from "./actions/storeTransferRecipientToContext";
import {storeTransferValueToContext} from "./actions/storeTransferValueToContext";
import {promptRecipient} from "./actions/promptRecipient";
import {promptValue} from "./actions/promptValue";
import {summarize} from "./actions/summarize";
import {strings} from "../../languages/strings";

export interface TransferXDaiContext extends ProcessContext
{
    transfer?: {
        recipient: {
            type:string,
            data:Address
        },
        value: {
            type:string,
            data:BN
        }
    }
}

/**
 * Transfer xDai
 */
const processDefinition = createMachine<TransferXDaiContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "isTransferPreconfigured",
                    target:"summarize"
                },{
                    target:"promptRecipient"
                }],
                "omo.cancel": "stop"
            }
        },
        promptRecipient: {
            entry: "promptRecipient",
            on: {
                "omo.answer": {
                    actions: "storeTransferRecipientToContext",
                    target: "promptValue"
                },
                "omo.trigger": {
                    actions: "promptRecipient"
                },
                "omo.cancel": "stop"
            }
        },
        promptValue: {
            entry: "promptValue",
            on: {
                "omo.back": {
                    target: "promptRecipient"
                },
                "omo.answer": {
                    actions: "storeTransferValueToContext",
                    target: "summarize"
                },
                "omo.trigger": {
                    actions: "promptValue"
                },
                "omo.cancel": "stop"
            }
        },
        summarize: {
            entry: "summarize",
            on: {
                "omo.back": {
                    target: "promptValue"
                },
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: "summarize"
                },
                "omo.answer": "transferXDai"
            }
        },
        transferXDai: {
            entry: "notifyInProgress",
            invoke: {
                id: 'transferXDai',
                src: "transferXDaiService",
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
                        "promptSuccess"
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
                    actions: "promptSuccess"
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
        "transferXDaiService": transferXDaiService
    },
    guards: {
        "isTransferPreconfigured": isTransferPreconfigured
    },
    actions: {
        "setError": assign(
        context => {
            context.result = strings.wallet.processes.transferXDai.errorMessage(context)
            return context;
        }),
        "setResult": assign(
        context => {
            context.result = strings.wallet.processes.transferXDai.successMessage(context)
            return context;
        }),
        "notifyInProgress": notifyInProgress,
        "promptError": promptError,
        "promptSuccess":promptSuccess,
        "storeTransferRecipientToContext": storeTransferRecipientToContext,
        "storeTransferValueToContext": storeTransferValueToContext,
        "promptRecipient": promptRecipient,
        "promptValue": promptValue,
        "summarize": summarize
    }
});

export const transferXDai: ProcessDefinition = {
    name: "transferXDai",
    stateMachine: processDefinition
};
