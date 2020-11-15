import { assign, createMachine, send } from "xstate";
import { ProcessContext } from "src/libs/o-processes/processContext";
import { ProcessEvent } from "src/libs/o-processes/processEvent";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";

const promptTrustReceiver: ProcessEvent = {
    type: "omo.prompt",
    message: "Enter the address of the person that you want ot trust",
    data: {
        id: "promptTrustReceiver",
        fields: {
            "trustReceiver": {
                type: "ethereumAddress",
                label: "I trust"
            }
        }
    }
};

/**
 * Set trust
 */
const processDefinition = createMachine<ProcessContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": {
                    actions: [
                        send(promptTrustReceiver),
                        assign({
                            other: (context) => {
                                context.other["omo.prompt"] = promptTrustReceiver.data;
                                return context.other;
                            }
                        })
                    ]
                },
                "omo.prompt": {
                    target: "prompt"
                },
                "omo.cancel": "stop",
                "omo.stop": "stop"
            }
        },
        prompt: {
            on: {
                "omo.answer": {
                    actions: [
                        assign({
                            other: (context, event) => {
                                context.other["omo.answer"] = event.data;
                                return context.other;
                            }
                        }),
                        send(<ProcessEvent>{
                            type: "omo.continue",
                        })
                    ]
                },
                "omo.continue": {
                },
                "omo.cancel": "stop",
                "omo.stop": "stop"
            }
        },
        stop: {
            type: "final"
        }
    }
}, {
    guards: {
    },
    actions: {
    }
});

export const setTrust: ProcessDefinition = {
    name: "setTrust",
    stateMachine: processDefinition
};
