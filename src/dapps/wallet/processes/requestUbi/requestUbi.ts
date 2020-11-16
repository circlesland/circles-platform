import { createMachine, send } from "xstate";
import { ProcessContext } from "src/libs/o-processes/processContext";
import { ProcessEvent } from "src/libs/o-processes/processEvent";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import {recentlyGotUbi} from "./guards/recentlyGotUbi";
import {setNextPossibleUbiRetrieval} from "./actions/setNextPossibleUbiRetrieval";
import {canRetrieveNewUbi} from "./guards/canRetrieveNewUbi";
import {getUbi} from "./services/getUbi";

/**
 * Requests UBI
 */
const processDefinition = createMachine<ProcessContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: recentlyGotUbi,
                    actions: [
                        setNextPossibleUbiRetrieval,
                        send({
                            type: "omo.notification",
                            message: "You recently requested your UBI. You can send only one request every 12 hours."
                        })
                    ]
                }, {
                    cond: canRetrieveNewUbi,
                    actions: [
                        setNextPossibleUbiRetrieval,
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
                src: getUbi,
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
});

export const requestUbi: ProcessDefinition = {
    name: "requestUbi",
    stateMachine: processDefinition
};
