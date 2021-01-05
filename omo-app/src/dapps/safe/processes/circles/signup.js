import { createMachine } from "xstate";
import { strings } from "../../data/strings";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { hubSignupService } from "../../services/hubSignupService";
const str = strings.safe.processes.signup;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "signup"
            }
        },
        signup: {
            entry: sendInProgressPrompt(() => ""),
            invoke: {
                id: 'signup',
                src: hubSignupService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(() => ""),
                    target: "success"
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
export const signup = {
    name: "signup",
    stateMachine: processDefinition
};
