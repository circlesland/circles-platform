import { assign, createMachine, send } from "xstate";
import { ProcessContext } from "src/libs/o-processes/processContext";
import { ProcessEvent } from "src/libs/o-processes/processEvent";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { Address } from "../../../../libs/o-circles-protocol/interfaces/address";
import { transferXDai } from "../transferXDai/transferXDai";
import { config } from "../../../../libs/o-circles-protocol/config";
import { promptError } from "../promptError";
import { promptSuccess } from "../promptSuccess";
import { strings } from "../../data/strings";


export interface JumpstartContext extends ProcessContext {
    jumpstart?: {
        recipient?: {
            type: string,
            data: Address
        }
    }
}

/**
 * Transfer xDai
 */
const processDefinition = createMachine<JumpstartContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "isPreconfigured",
                    target: "transferXDai"
                }, {
                    target: "promptRecipient"
                }],
                "omo.cancel": "stop"
            }
        },
        promptRecipient: {
            entry: "promptRecipient",
            on: {
                "omo.answer": {
                    actions: "storeJumpstartRecipientToContext",
                    target: "transferXDai"
                },
                "omo.cancel": "stop"
            }
        },
        transferXDai: {
            invoke: {
                id: 'transferXDai',
                src: transferXDai.stateMachine,
                autoForward: true,
                data: {
                    transfer: (context, event) => {
                        return {
                            recipient: context.jumpstart.recipient,
                            value: {
                                type: "wei",
                                data: config.getCurrent().JUMPSTART_MONEY
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    guards: {
        "isPreconfigured": (context) => context.jumpstart !== undefined
    },
    actions: {
        "setError": assign(
            context => {
                context.result = strings.safe.processes.jumpstart.errorMessage(context)
                return context;
            }),
        "setResult": assign(
            context => {
                context.result = strings.safe.processes.jumpstart.successMessage(context)
                return context;
            }),
        "promptError": promptError,
        "promptSuccess": promptSuccess,
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
        "storeJumpstartRecipientToContext": assign((context: JumpstartContext, event: any) => {
            if (!context.jumpstart) {
                context.jumpstart = {};
            }
            context.jumpstart.recipient = event.data.fields.address;
            return context;
        }),
    }
});

export const jumpstart: ProcessDefinition = {
    name: "jumpstart",
    stateMachine: processDefinition
};
