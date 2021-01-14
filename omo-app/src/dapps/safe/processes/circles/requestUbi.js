import { createMachine } from "xstate";
import { strings } from "../../data/strings";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { requestUbiService } from "../../services/requestUbiService";
import { sendShellEvent } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
/**
 * Requests UBI
 */
const str = strings.safe.processes.requestUbi;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "requestUbi"
            }
        },
        requestUbi: {
            entry: [
                sendInProgressPrompt(str.titleProgress),
                sendShellEvent({
                    type: "shell.closeModal"
                })
            ],
            invoke: {
                id: 'requestingUbi',
                src: requestUbiService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(str.successMessage),
                    target: "stop"
                }
            }
        },
        success: {
            entry: sendSuccessPrompt,
            on: {
                "process.continue": "stop",
                "process.cancel": "stop"
            },
            after: {
                2000: { target: 'stop' }
            }
        },
        error: {
            entry: sendErrorPrompt,
            on: {
                "process.continue": "stop",
                "process.cancel": "stop"
            }
        },
        stop: {
            type: "final"
        }
    }
});
export const requestUbi = {
    name: "requestUbi",
    stateMachine: processDefinition
};
