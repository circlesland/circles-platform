import { strings } from "../../data/strings";
import { createMachine } from "xstate";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { sendShellEvent } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { fundSafeService } from "../../services/fundSafeService";
import { NavigateTo } from "../../../../libs/o-events/navigateTo";
const str = strings.safe.processes.jumpstart;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": {
                    target: "fundSafe"
                }
            }
        },
        fundSafe: {
            entry: sendInProgressPrompt(str.titleProgress),
            invoke: {
                id: 'fundSafe',
                src: fundSafeService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(() => "Your safe isnow funded."),
                    target: "success"
                }
            }
        },
        success: {
            entry: [
                sendSuccessPrompt,
                sendShellEvent(new NavigateTo("/safe/transactions"))
            ],
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
export const fundSafe = {
    name: "fundSafe",
    stateMachine: processDefinition
};
