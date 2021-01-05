import { strings } from "../../data/strings";
import { createMachine } from "xstate";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import { hubSignupService } from "../../services/hubSignupService";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { fundSafeService } from "../../services/fundSafeService";
const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "introduction"
            }
        },
        introduction: {
            entry: sendPrompt((context) => {
                return {
                    title: "Create a Circles account?",
                    nextButtonTitle: "Next",
                    banner: {
                        component: Banner,
                        data: {
                            text: `Clicking 'Next' will sign you up for Circles.
A small amount of the credits you received from your invite will be used to do that.`
                        }
                    },
                    artifacts: {}
                };
            }),
            on: {
                "process.continue": [{
                        target: "fundSafe"
                    }]
            }
        },
        fundSafe: {
            entry: sendInProgressPrompt(str.progressFundSafe),
            invoke: {
                id: 'fundSafe',
                src: fundSafeService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(str.successFundSafe),
                    target: "hubSignup"
                }
            }
        },
        hubSignup: {
            entry: sendInProgressPrompt(str.progressHubSignup),
            invoke: {
                id: 'hubSignup',
                src: hubSignupService,
                onError: {
                    actions: "setError",
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(str.successHubSignup),
                    target: "success"
                }
            }
        },
        success: {
            entry: [
                sendSuccessPrompt
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
export const signupAtCircles = {
    name: "signupAtCircles",
    stateMachine: processDefinition
};
