import { createMachine } from "xstate";
import { strings } from "../../data/strings";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { ethereumAddress } from "../../../../libs/o-processes/artifacts/ethereumAddress";
import { inviteCredits } from "../../../../libs/o-processes/artifacts/inviteCredits";
import { sendInviteCreditsService } from "../../services/sendInviteCreditsService";
/**
 * Transfer xDai
 */
const str = strings.safe.processes.sendInviteCredits;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "promptRecipient"
            }
        },
        promptRecipient: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleRecipient(),
                    nextButtonTitle: "Next",
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerRecipient()
                        }
                    },
                    artifacts: Object.assign({}, ethereumAddress("recipient", null, false, true))
                };
            }),
            on: {
                "process.continue": {
                    actions: storePromptResponse,
                    target: "promptValue"
                },
                "process.cancel": "stop"
            }
        },
        promptValue: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleValue(),
                    nextButtonTitle: "Next",
                    canGoBack: true,
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerValue()
                        }
                    },
                    artifacts: Object.assign({}, inviteCredits("value"))
                };
            }),
            on: {
                "process.back": {
                    target: "promptRecipient"
                },
                "process.continue": {
                    actions: storePromptResponse,
                    target: "summarize"
                },
                "process.cancel": "stop"
            }
        },
        summarize: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleSummary(),
                    nextButtonTitle: "Transfer xDai",
                    canGoBack: true,
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerSummary()
                        }
                    },
                    artifacts: Object.assign(Object.assign({}, ethereumAddress("recipient", str.titleRecipient(), true)), inviteCredits("value", str.titleValue(), true))
                };
            }),
            on: {
                "process.back": {
                    target: "promptValue"
                },
                "process.cancel": "stop",
                "process.continue": "transferXDai"
            }
        },
        transferXDai: {
            entry: sendInProgressPrompt(str.titleProgress),
            invoke: {
                id: 'transferXDai',
                src: sendInviteCreditsService,
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
});
export const sendInviteCredits = {
    name: "sendInviteCredits",
    stateMachine: processDefinition
};
