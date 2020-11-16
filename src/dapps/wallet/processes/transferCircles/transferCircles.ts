import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {BN} from "ethereumjs-util";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {transferCirclesService} from "./services/transferCirclesService";
import {setTrustService} from "../setTrust/services/setTrustService";
import {promptError} from "../promptError";
import {promptSuccess} from "../promptSuccess";

export interface TransferCirclesContext extends ProcessContext
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
 * Transfer circles
 */
const processDefinition = createMachine<TransferCirclesContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: (context) => context.transfer !== undefined,
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
                    actions: assign((context: any, event: any) =>
                    {
                        if (!context.transfer)
                        {
                            context.transfer = {};
                        }
                        context.transfer.recipient = event.data.fields.address;
                    }),
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
                "omo.answer": {
                    actions: assign((context: any, event: any) =>
                        context.transfer.value = event.data.fields.value),
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
                "omo.cancel": "stop"
            }
        },
        transferCircles: {
            entry: send({
                type: "omo.notification",
                message: "Transferring circles .."
            }),
            invoke: {
                id: 'transferCircles',
                src: transferCirclesService,
                onError: {
                    actions: promptError,
                    target: "error"
                },
                onDone: {
                    actions: promptSuccess,
                    target: "success"
                }
            }
        },
        success: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: promptSuccess
                }
            }
        },
        error: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: promptError
                }
            }
        },
        stop: {
            type: "final"
        }
    }
}, {
    guards: {},
    actions: {
        "promptRecipient": send({
            type: "omo.prompt",
            message: "Please enter the recipient's address below and click 'Next'",
            data: {
                id: "recipient",
                fields: {
                    "address": {
                        type: "ethereumAddress",
                        label: "Address"
                    }
                }
            }
        }),
        "promptValue": send({
            type: "omo.prompt",
            message: "Please enter the Value you want to transfer and click 'Next'",
            data: {
                id: "value",
                fields: {
                    "value": {
                        type: "wei",
                        label: "Value"
                    }
                }
            }
        }),
        "summarize": send((context: TransferCirclesContext) =>
        {
            return {
                type: "omo.prompt",
                message: "Click 'Next' to confirm the transaction.",
                data: {
                    id: "confirmation",
                    fields: {
                        "value": {
                            type: "wei",
                            label: "Value",
                            value: context.transfer.value
                        },
                        "recipient": {
                            type: "ethereumAddress",
                            label: "To",
                            value: context.transfer.recipient
                        }
                    }
                }
            }
        })
    }
});

export const transferCircles: ProcessDefinition = {
    name: "transferCircles",
    stateMachine: processDefinition
};
