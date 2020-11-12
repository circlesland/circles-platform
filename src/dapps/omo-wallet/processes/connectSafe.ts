import { createMachine, send } from "xstate";
import { ProcessContext } from "src/processes/processContext";
import { ProcessEvent } from "src/processes/processEvent";
import { ProcessDefinition } from "src/processes/processManifest";

/**
 * Connect safe
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
                "omo.continue": "setTrust"
            }
        },
        connectSafe: {
            invoke: {
                id: 'connectSafe',
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

export const connectSafe: ProcessDefinition = {
    name: "connectSafe",
    stateMachine: processDefinition
};
