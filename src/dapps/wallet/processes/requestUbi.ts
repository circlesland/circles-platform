import { createMachine, send } from "xstate";
import { ProcessContext } from "src/libs/o-processes/processContext";
import { ProcessEvent } from "src/libs/o-processes/processEvent";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";

const TwelveHours = 12 * 60 * 60 * 60 * 1000;
const TwentySeconds = 20 * 1000;

/**
 * Requests UBI
 */
const processDefinition = createMachine<ProcessContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "recentlyGotUbi?",
                    actions: [
                        "setNextPossibleUbiRetrieval",
                        send({
                            type: "omo.notification",
                            message: "You recently requested your UBI. You can send only one request every 12 hours."
                        })
                    ]
                }, {
                    cond: "canRetrieveNewUbi?",
                    actions: [
                        "setNextPossibleUbiRetrieval",
                        send({
                            type: "omo.continue",
                            message: "Requesting UBI .."
                        })
                    ]
                }, {
                    actions: send({
                        type: "omo.notification",
                        message: "You must wait at least 20 seconds before you can try again."
                    })
                }],
                "omo.stop": "stop",
                "omo.notification": "stop",
                "omo.continue": "requestUbi"
            }
        },
        requestUbi: {
            invoke: {
                id: 'requestingUbi',
                src: async (context) => (await context.person.getUBI(context.account, context.safe)),
                onError: {
                    actions: send({
                        type: "omo.error",
                        message: "An error occurred during the UBI request. Please try again later."
                    })
                },
                onDone: {
                    actions: [
                        "setLastSuccessfulUbiRetrieval",
                        send({
                            type: "omo.success",
                            data: {
                                type: "ubi"
                            }
                        })
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
        "recentlyGotUbi?": () => {
            const lastSuccessfulUbiRetrieval = localStorage.getItem("omo.ubiService.lastSuccessfulUbiRetrieval");
            return lastSuccessfulUbiRetrieval
                ? Date.now() - parseInt(lastSuccessfulUbiRetrieval) < TwelveHours
                : false;
        },
        "canRetrieveNewUbi?": (context, event) => {
            const now = Date.now();

            // A User can retrieve new UBI when:
            // 1. At least 12 hours after the last successful retrieval passed by
            const lastSuccessfulUbiRetrieval = localStorage.getItem("omo.ubiService.lastSuccessfulUbiRetrieval");
            const recentlyGotUbi = !lastSuccessfulUbiRetrieval
                ? false
                : Date.now() - parseInt(lastSuccessfulUbiRetrieval) < TwelveHours;

            if (recentlyGotUbi)
                return false;

            // 2. The omo.ubiService.nextPossibleUbiRetrieval time is in the past or not set
            const nextPossibleUbiRetrieval = localStorage.getItem("omo.ubiService.nextPossibleUbiRetrieval");
            return !nextPossibleUbiRetrieval
                ? true
                : now > parseInt(nextPossibleUbiRetrieval);
        }
    },
    actions: {
        "setNextPossibleUbiRetrieval": () => {
            localStorage.setItem("omo.ubiService.nextPossibleUbiRetrieval", (Date.now() + TwentySeconds).toString());
        },
        "setLastSuccessfulUbiRetrieval": () => {
            localStorage.setItem("omo.ubiService.lastSuccessfulUbiRetrieval", Date.now().toString());
        }
    }
});

export const requestUbi: ProcessDefinition = {
    name: "requestUbi",
    stateMachine: processDefinition
};
