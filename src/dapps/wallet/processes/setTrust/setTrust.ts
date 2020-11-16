import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import {setTrustService} from "./services/setTrustService";
import {promptError} from "../promptError";
import {promptSuccess} from "../promptSuccess";

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
                "omo.trigger": "promptTrustReceiver",
                "omo.cancel": "stop"
            }
        },
        promptTrustReceiver: {
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
                "omo.answer": [{
                    cond: (ctx) => !!ctx.setTrust.trustLimit,
                    actions: assign((context: any, event: any) =>
                    {
                        if (!context.setTrust)
                        {
                            context.transferXDaiService = {};
                        }
                        context.setTrust.trustReceiver = event.data.fields.trustReceiver;
                    }),
                    target: "summarize"
                }, {
                    cond: (ctx) => !ctx.setTrust.trustLimit,
                    actions: assign((context: any, event: any) =>
                    {
                        if (!context.setTrust)
                        {
                            context.transferXDaiService = {};
                        }
                        context.setTrust.trustReceiver = event.data.fields.trustReceiver;
                    }),
                    target: "promptTrustLimit"
                }],
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
                    message: `Click 'Next' to add ${context.setTrust.trustReceiver.data} to your list of trusted persons.`,
                    data: {
                        id: "confirmation",
                        fields: {
                            "trustReceiver": {
                                type: "ethereumAddress",
                                label: "Trust receiver",
                                value: context.setTrust.trustReceiver
                            }/*,
                            "trustLimit": {
                                type: "percent",
                                label: "Trust limit (%)",
                                value: context.setTrust.trustLimit
                            }*/
                        }
                    }
                }
            }),
            on: {
                "omo.cancel": "stop",
                "omo.answer": "setTrust"
            }
        },
        setTrust: {
            invoke: {
                id: 'setTrust',
                src: setTrustService,
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

export const setTrust: ProcessDefinition = {
    name: "setTrust",
    stateMachine: processDefinition
};
