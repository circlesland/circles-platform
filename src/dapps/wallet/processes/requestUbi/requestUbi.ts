import { createMachine, send } from "xstate";
import { ProcessContext } from "src/libs/o-processes/processContext";
import { ProcessEvent } from "src/libs/o-processes/processEvent";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import {recentlyGotUbi} from "./guards/recentlyGotUbi";
import {getUbi} from "./services/getUbi";
import {promptError} from "../promptError";
import {promptSuccess} from "../promptSuccess";
import {setLastSuccessfulUbiRetrieval} from "./actions/setLastSuccessfulUbiRetrieval";
import {notifyInProgress} from "./actions/notifyInProgress";
import {promptAlreadyRequested} from "./actions/promptAlreadyRequested";

/**
 * Requests UBI
 */
const processDefinition = createMachine<ProcessContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": [{
                    cond: "recentlyGotUbi",
                    actions: "promptAlreadyRequested",
                }, {
                    target: "requestUbi"
                }],
                "omo.answer": "stop",
                "omo.cancel": "stop",
            }
        },
        requestUbi: {
            entry: "notifyInProgress",
            invoke: {
                id: 'requestingUbi',
                src: "getUbi",
                onError: {
                    actions: "promptError",
                    target: "error"
                },
                onDone: {
                    actions: [
                        "setLastSuccessfulUbiRetrieval",
                        "promptSuccess"
                    ],
                    target: "success"
                }
            }
        },
        success: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: "promptSuccess"
                }
            }
        },
        error: {
            on: {
                "omo.answer": "stop",
                "omo.cancel": "stop",
                "omo.trigger": {
                    actions: "promptError"
                }
            }
        },
        stop: {
            type: "final"
        }
    }
}, {
    services: {
        "getUbi": getUbi
    },
    guards: {
        "recentlyGotUbi": recentlyGotUbi
    },
    actions: {
        "promptError": promptError,
        "promptSuccess":promptSuccess,
        "notifyInProgress": notifyInProgress,
        "setLastSuccessfulUbiRetrieval": setLastSuccessfulUbiRetrieval,
        "promptAlreadyRequested":promptAlreadyRequested
    }
});

export const requestUbi: ProcessDefinition = {
    name: "requestUbi",
    stateMachine: processDefinition
};
