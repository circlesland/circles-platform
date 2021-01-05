import { createMachine } from "xstate";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { ethereumAddress } from "../../../../libs/o-processes/artifacts/ethereumAddress";
import { strings } from "../../data/strings";
import { setTrustService } from "../../services/setTrustService";
/**
 * Set trust
 */
const str = strings.safe.processes.setTrust;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "promptTrustReceiver"
            }
        },
        promptTrustReceiver: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleTrustReceiver(),
                    nextButtonTitle: "Trust",
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerTrustRecipient()
                        }
                    },
                    artifacts: Object.assign({}, ethereumAddress("trustReceiver"))
                };
            }),
            on: {
                "process.continue": {
                    actions: storePromptResponse,
                    target: "setTrust"
                },
                "process.cancel": "stop"
            }
        },
        setTrust: {
            entry: sendInProgressPrompt(str.titleWorking),
            invoke: {
                id: 'setTrust',
                src: setTrustService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(str.successMessage),
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
}, {
    guards: {
        "isFullyConfigured": (context => !!context.data.trustReceiver && !!context.data.trustReceiver.value)
    }
});
export const setTrust = {
    name: "setTrust",
    stateMachine: processDefinition
};
