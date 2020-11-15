import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent, PromptField} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {BN} from "ethereumjs-util";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import context from "svelte/types/compiler/parse/read/context";

export interface SetTrustContext extends ProcessContext
{
    setTrust?: {
        trustReceiver: Address,
        trustLimit: number
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
                "omo.trigger": "prompttrustReceiver",
                "omo.cancel": "stop"
            }
        },
        prompttrustReceiver: {
            entry: send({
                type: "omo.prompt",
                message: "Please enter the address of the person you want to trust and click 'Next'",
                data: {
                    id: "setTrust",
                    fields: {
                        "trustReceiver": {
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
                        if (!context.setTrust)
                        {
                            context.setTrust = {};
                        }
                        context.setTrust.trustReceiver = event.data.fields.trustReceiver;
                    }),
                    target: "promptTrustLimit"
                },
                "omo.cancel": "stop"
            }
        },
        promptTrustLimit: {
            entry: send({
                type: "omo.prompt",
                message: "Please enter the trust limit in percent and click 'Next'",
                data: {
                    id: "setTrust",
                    fields: {
                        "trustLimit": {
                            type: "percent",
                            label: "Trust limit %"
                        }
                    }
                }
            }),
            on: {
                "omo.answer": {
                    actions: assign((context: any, event: any) =>
                        context.setTrust.trustLimit = event.data.fields.trustLimit),
                    target: "summarize"
                },
                "omo.cancel": "stop"
            }
        },
        summarize: {
            entry: send((context: SetTrustContext) =>
            {
                return {
                    type: "omo.prompt",
                    message: `Enter 'Deine Mudda oida' and click 'Next' to give ${context.setTrust.trustReceiver.data} trust.`,
                    data: {
                        id: "confirmation",
                        fields: {
                            "trustReceiver": {
                                type: "ethereumAddress",
                                label: "Trust receiver",
                                value: context.setTrust.trustReceiver
                            },
                            "trustLimit": {
                                type: "percent",
                                label: "Trust limit (%)",
                                value: context.setTrust.trustLimit
                            },
                            "confirmation": {
                                type: "string",
                                label: "Confirmation phrase"
                            }
                        }
                    }
                }
            }),
            on: {
                "omo.cancel": "stop"
            }
        },
        transferCircles: {
            invoke: {
                id: 'transferCircles',
                src: async (context) => null,
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

export const setTrust: ProcessDefinition = {
    name: "setTrust",
    stateMachine: processDefinition
};
