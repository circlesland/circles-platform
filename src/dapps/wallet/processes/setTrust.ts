import {createMachine, send} from "xstate";
import {ProcessContext} from "../../../processes/processContext";
import {ProcessEvent} from "../../../processes/processEvent";
import {ProcessDefinition} from "../../../processes/processManifest";

/**
 * Set trust
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
        setTrust: {
            invoke: {
                id: 'setTrust',
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

export const setTrust:ProcessDefinition = {
    name:"setTrust",
    stateMachine: processDefinition
};
