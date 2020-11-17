import {assign, createMachine} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {setTrustService} from "./services/setTrustService";
import {promptError} from "../promptError";
import {promptSuccess} from "../promptSuccess";
import {promptTrustReceiver} from "./actions/promptTrustReceiver";
import {promptTrustLimit} from "./actions/promptTrustLimit";
import {summarize} from "./actions/summarize";
import {storeTrustReceiverToContext} from "./actions/storeTrustReceiverToContext";
import {storeTrustLimitToContext} from "./actions/storeTrustLimitToContext";
import {notifyInProgress} from "./actions/notifyInProgress";
import {isTrustLimitAlreadySet} from "./guards/isTrustLimitAlreadySet";
import {isTrustReceiverAlreadySet} from "./guards/isTrustReceiverAlreadySet";
import {strings} from "../../languages/strings";

export interface SetTrustContext extends ProcessContext
{
    setTrust?: {
        trustReceiver: {
            type: "ethereumAddress",
            data: Address
        },
        trustLimit: {
            type: "percent",
            data: any
        }
    }
}

/**
 * Transfer circles
 */
const processDefinition = createMachine<SetTrustContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "isFullyConfigured",
                    target: "summarize"
                }, {
                    cond: "isTrustReceiverAlreadySet",
                    target: "promptTrustLimit"
                }, {
                    target: "promptTrustReceiver"
                }],
                "omo.cancel": "stop"
            }
        },
        promptTrustReceiver: {
            entry: "promptTrustReceiver",
            on: {
                "omo.answer": [{
                    cond: "isTrustLimitAlreadySet",
                    actions: "storeTrustReceiverToContext",
                    target: "summarize"
                }, {
                    target: "promptTrustLimit"
                }],
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: "promptTrustReceiver"
                }
            }
        },
        promptTrustLimit: {
            entry: "promptTrustLimit",
            on: {
                "omo.back": {
                    target: "promptTrustReceiver"
                },
                "omo.answer": {
                    actions: "storeTrustLimitToContext",
                    target: "summarize"
                },
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: "promptTrustLimit"
                }
            }
        },
        summarize: {
            entry: "summarize",
            on: {
                "omo.back": {
                    target: "promptTrustLimit"
                },
                "omo.cancel": "stop",
                "omo.answer": "setTrust",
                "omo.trigger": {
                    actions: "summarize"
                }
            }
        },
        setTrust: {
            entry: "notifyInProgress",
            invoke: {
                id: 'setTrust',
                src: "setTrustService",
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
        "setTrustService": setTrustService
    },
    guards: {
        "isTrustLimitAlreadySet": isTrustLimitAlreadySet,
        "isTrustReceiverAlreadySet": isTrustReceiverAlreadySet,
        "isFullyConfigured": (context => isTrustReceiverAlreadySet(context) && isTrustLimitAlreadySet(context)),
        "isTrustLimitNotSet": (context => !isTrustLimitAlreadySet(context)),
    },
    actions: {
        "setError": assign(
            context => {
                context.result = strings.wallet.processes.setTrust.errorMessage(context)
                return context;
            }),
        "setResult": assign(
            context => {
                context.result = strings.wallet.processes.setTrust.successMessage(context)
                return context;
            }),
        "promptError": promptError,
        "promptSuccess":promptSuccess,
        "promptTrustReceiver": promptTrustReceiver,
        "promptTrustLimit": promptTrustLimit,
        "notifyInProgress": notifyInProgress,
        "summarize":summarize,
        "storeTrustReceiverToContext": storeTrustReceiverToContext,
        "storeTrustLimitToContext": storeTrustLimitToContext
    }
});

export const setTrust: ProcessDefinition = {
    name: "setTrust",
    stateMachine: processDefinition
};
