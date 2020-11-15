import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {transferXDai} from "../transferXDai/transferXDai";
import {config} from "../../../../libs/o-circles-protocol/config";

export interface JumpstartContext extends ProcessContext
{
    jumpstart?: {
        recipient?: {
            type:string,
            data:Address
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
                    cond: (context) => context.jumpstart !== undefined,
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
                    actions: assign((context: JumpstartContext, event: any) =>
                    {
                        if (!context.jumpstart)
                        {
                            context.jumpstart = {};
                        }
                        context.jumpstart.recipient = event.data.fields.address;
                        return context;
                    }),
                    target: "transferXDai"
                },
                "omo.cancel": "stop"
            }
        },
        transferXDai: {
            invoke: {
                id: 'transferXDai',
                src: transferXDai.stateMachine,
                data: {
                    transfer: (context, event) =>
                    {
                        return {
                            recipient: context.jumpstart.recipient,
                            value: {
                                type: "wei",
                                data: config.getCurrent().JUMPSTART_MONEY
                            }
                        }
                    }
                },
                onError: {
                    actions: []
                },
                onDone: {
                    actions: []
                }
            },
            on: {
                "omo.error": "stop",
                "omo.success": "stop"
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

export const jumpstart: ProcessDefinition = {
    name: "jumpstart",
    stateMachine: processDefinition
};
