import {createMachine, send} from "xstate";
import {ProcessContext} from "../../../processes/processContext";
import {ProcessEvent} from "../../../processes/processEvent";
import {ProcessDefinition} from "../../../processes/processManifest";

/**
 * Transfer circles
 */
const processDefinition = createMachine<ProcessContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "?",
                    actions: [
                        send({
                            type: "omo.notification",
                            message: "Condition failed."
                        })
                    ]
                }, {
                    cond: "?",
                    actions: [
                        send({
                            type: "omo.continue",
                            message: "Condition met. Continuing .."
                        })
                    ]
                }],
                "omo.stop": "stop",
                "omo.notification": "stop",
                "omo.continue": "transferCircles"
            }
        },
        transferCircles: {
            invoke: {
                id: 'transferCircles',
                src: async (context) => null,
                onError: {
                    actions: [
                    ]
                },
                onDone: {
                    actions: [
                    ]
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
    guards: {
    },
    actions: {
    }
});

export const transferCircles:ProcessDefinition = {
    name:"transferCircles",
    stateMachine: processDefinition
};
