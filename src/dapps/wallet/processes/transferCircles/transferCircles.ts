import {createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {BN} from "ethereumjs-util";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {transferCirclesService} from "./services/transferCirclesService";
import {promptError} from "../promptError";
import {promptSuccess} from "../promptSuccess";
import {storeTransferValueToContext} from "./actions/storeTransferValueToContext";
import {storeTransferRecipientToContext} from "./actions/storeTransferRecipientToContext";
import {promptRecipient} from "./actions/promptRecipient";
import {promptValue} from "./actions/promptValue";
import {summarize} from "./actions/summarize";
import {transferRecipientIsPreconfigured} from "./guards/transferRecipientIsPreconfigured";
import {notifyInProgress} from "./actions/notifyInProgress";
import {transferValueIsPreconfigured} from "./guards/transferValuetIsPreconfigured";

export interface TransferCirclesContext extends ProcessContext
{
    transfer?: {
        recipient?: {
            type:"ethereumAddress",
            data:Address
        },
        value?: {
            type:"wei",
            data:BN
        }
    }
}

/**
 * Transfer circles
 */
const processDefinition = createMachine<TransferCirclesContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "transferRecipientIsPreconfigured",
                    target:"promptValue"
                }, {
                    cond: "isFullyConfigured",
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
                "omo.answer": [{
                    actions: "storeTransferRecipientToContext",
                    cond: "transferValueIsPreconfigured",
                    target: "summarize"
                },{
                    actions: "storeTransferRecipientToContext",
                    target: "promptValue"
                }],
                "omo.trigger": {
                    actions: "promptRecipient"
                },
                "omo.cancel": "stop"
            }
        },
        promptValue: {
            entry: "promptValue",
            on: {
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
                "omo.trigger": {
                    actions: "summarize"
                },
                "omo.answer": "transferCircles",
                "omo.cancel": "stop"
            }
        },
        transferCircles: {
            entry: "notifyInProgress",
            invoke: {
                id: 'transferCircles',
                src: "transferCirclesService",
                onError: {
                    actions: "promptError",
                    target: "error"
                },
                onDone: {
                    actions: "promptSuccess",
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
        "transferCirclesService": transferCirclesService
    },
    guards: {
        "transferRecipientIsPreconfigured": transferRecipientIsPreconfigured,
        "transferValueIsPreconfigured": transferValueIsPreconfigured,
        "isFullyConfigured": context => transferRecipientIsPreconfigured(context) && transferValueIsPreconfigured(context)
    },
    actions: {
        "promptError": promptError,
        "notifyInProgress": notifyInProgress,
        "promptSuccess":promptSuccess,
        "storeTransferValueToContext": storeTransferValueToContext,
        "storeTransferRecipientToContext": storeTransferRecipientToContext,
        "promptRecipient": promptRecipient,
        "promptValue": promptValue,
        "summarize": summarize
    }
});

export const transferCircles: ProcessDefinition = {
    name: "transferCircles",
    stateMachine: processDefinition
};
