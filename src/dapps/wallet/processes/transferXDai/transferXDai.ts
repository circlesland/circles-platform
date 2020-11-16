import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {BN} from "ethereumjs-util";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {transferXDaiService} from "./services/transferXDaiService";
import {setTrustService} from "../setTrust/services/setTrustService";
import {promptError} from "../promptError";
import {promptSuccess} from "../promptSuccess";

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
                    cond: (context) => context.transfer !== undefined,
                    target:"summarize"
                },{
                    target:"promptRecipient"
                }],
                "omo.cancel": "stop"
            }
        },
        promptRecipient: {
            entry: send({
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
                "omo.cancel": "stop"
            }
        },
        promptValue: {
            entry: send({
                type: "omo.prompt",
                message: "Please enter the xDai value you want to transfer and click 'Next'",
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
            on: {
                "omo.answer": {
                    actions: assign((context: any, event: any) =>
                        context.transfer.value = event.data.fields.value),
                    target: "summarize"
                },
                "omo.cancel": "stop"
            }
        },
        summarize: {
            entry: send((context: TransferXDaiContext) =>
            {
                return {
                    type: "omo.prompt",
                    message: "Click 'Next' to confirm the transaction",
                    data: {
                        id: "confirmation",
                        fields: {
                            "value": {
                                type: "wei",
                                isReadonly: true,
                                label: "Value",
                                value: context.transfer.value
                            },
                            "recipient": {
                                type: "ethereumAddress",
                                isReadonly: true,
                                label: "Recipient",
                                value: context.transfer.recipient
                            }
                        }
                    }
                }
            }),
            on: {
                "omo.cancel": "stop",
                "omo.answer": "transferXDai"
            }
        },
        transferXDai: {
            invoke: {
                id: 'transferXDai',
                src: transferXDaiService,
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
                "omo.cancel": "stop"
            }
        },
        error: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop"
            }
        },
        stop: {
            type: "final"
        }
    }
}, {
    guards: {},
    actions: {}
});

export const transferXDai: ProcessDefinition = {
    name: "transferXDai",
    stateMachine: processDefinition
};
