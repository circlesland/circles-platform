import {createMachine, send} from "xstate";
import {BN} from "ethereumjs-util";
import {ProcessContext} from "../../../processes/processContext";
import {ProcessEvent} from "../../../processes/processEvent";

/**
 * A state machine that runs as service and requests the UBI for the user.
 */
const processDefinition = createMachine<ProcessContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "recentlyGotUbi?",
                    target: "ready",
                    actions: [
                        "setNextPossibleUbiRetrieval",
                        send({ type: "omo.notification", message: "You recently requested your UBI. You can send only one request every 12 hours." })
                    ]
                }, {
                    cond: "canRetrieveNewUbi?",
                    target: "requestUbi",
                    actions: "setNextPossibleUbiRetrieval"
                }, {
                    target: "ready",
                    actions: [
                        "setNextPossibleUbiRetrieval",
                        send({ type: "omo.notification", message: "You must wait at least 20 seconds before you can try again." })
                    ]
                }],
                "omo.stop": {
                    target: "stop"
                }
            }
        },
        requestUbi: {
            invoke: {
                id: 'requestingUbi',
                src: async (context) => context.person.getUBI(context.account, context.safe),
                onError: {
                    target: 'error'
                },
                onDone: {
                    actions: ["setLastSuccessfulUbiRetrieval"],
                    target: 'success'
                }
            }
        },
        error: {
            always: "stop",
            entry: send({ type: "omo.error", message: "An error occurred during the transfer. Please check your gas and try again." })
        },
        success: {
            always: "stop",
            entry: send({ type: "omo.success", receivedUbi: new BN("0")}) /* TODO: Get received UBI from response */
        },
        stop: {
            type: "final",
            entry: send({ type: "omo.stopped" })
        }
    }
}, {
    guards: {
    },
    actions: {
    }
});

export const transferCircles = processDefinition;
