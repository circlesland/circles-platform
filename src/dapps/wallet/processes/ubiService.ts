import {createMachine, send} from "xstate";
import {BN} from "ethereumjs-util";
import {ProcessContext} from "../../../processes/processContext";
import {ProcessEvent} from "../../../processes/processEvent";

const TwelveHours = 12 * 60 * 60 * 60 * 1000;
const TwentySeconds = 20 * 1000;

/**
 * A state machine that runs as service and requests the UBI for the user.
 */
const serviceDefinition = createMachine<ProcessContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "recentlyGotUbi?",
                    target: "ready",
                    actions: [
                        "setNextPossibleUbiRetrieval",
                        send({
                            type: "omo.message",
                            message: "You recently requested your UBI. You can send only one request every 12 hours."
                        })
                    ]
                }, {
                    cond: "canRetrieveNewUbi?",
                    target: "requestUbi",
                    actions: "setNextPossibleUbiRetrieval"
                }, {
                    target: "ready",
                    actions: [
                        "setNextPossibleUbiRetrieval",
                        send({
                            type: "omo.message",
                            message: "You must wait at least 20 seconds before you can try again."
                        })
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
            always: "ready",
            entry: send({
                type: "omo.error",
                message: "An error occurred during the UBI request. Please try again later."
            })
        },
        success: {
            always: "ready",
            entry: ((context1, event) =>
            {
                /* TODO: Fill the response event with meaningful values */
                return send({
                    type: "omo.success",
                    data: {
                        type: "ubi",
                        blockNo: new BN("0"),
                        to: context1.safe.address,
                        value: new BN("0")
                    }
                });
            })
        },
        stop: {
            type: "final",
            entry: send({type: "omo.stopped"})
        }
    }
}, {
    guards: {
        "recentlyGotUbi?": () =>
        {
            const lastSuccessfulUbiRetrieval = localStorage.getItem("omo.ubiService.lastSuccessfulUbiRetrieval");
            return lastSuccessfulUbiRetrieval
                ? Date.now() - parseInt(lastSuccessfulUbiRetrieval) < TwelveHours
                : false;
        },
        "canRetrieveNewUbi?": (context, event) =>
        {
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
        "setNextPossibleUbiRetrieval": () =>
        {
            localStorage.setItem("omo.ubiService.nextPossibleUbiRetrieval", (Date.now() + TwentySeconds).toString());
        },
        "setLastSuccessfulUbiRetrieval": () =>
        {
            localStorage.setItem("omo.ubiService.lastSuccessfulUbiRetrieval", Date.now().toString());
        }
    }
});

export const ubiService = serviceDefinition;
