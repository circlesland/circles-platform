import { assign, createMachine } from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import JumpstartIntro from "../../views/molecules/JumpstartIntro.svelte";
import { strings } from "../../data/strings";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { ethereumAddress } from "../../../../libs/o-processes/artifacts/ethereumAddress";
import { inviteCredits } from "../../../../libs/o-processes/artifacts/inviteCredits";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { transferJumpstartXDaiService } from "../../services/transferJumpstartXDaiService";
import { getForeignProfileService } from "../../services/getForeignProfile";
// TODO: Add checks to prevent from answering the same request twice
/**
 * Transfer jumpstart xDai
 */
const str = strings.safe.processes.jumpstart;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": {
                    target: "getForeignProfile"
                }
            }
        },
        getForeignProfile: {
            entry: sendInProgressPrompt(str.loadingForeignProfile),
            invoke: {
                id: 'getForeignProfile',
                src: getForeignProfileService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: assign((context, event) => {
                        context.data.foreignProfile = {
                            key: "foreignProfile",
                            type: "omo.sapien:1:profile",
                            value: event.data
                        };
                        return context;
                    }),
                    target: "intro"
                }
            }
        },
        intro: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleIntro(),
                    nextButtonTitle: `Empower ${context.data.foreignProfile.value.profile.firstName} ${context.data.foreignProfile.value.profile.lastName}`,
                    banner: {
                        component: JumpstartIntro,
                        data: {
                            header: str.introHeader(context),
                            subHeader: str.introSubHeader(),
                            body: str.introBody(context)
                        }
                    },
                    artifacts: {}
                };
            }),
            on: {
                "process.cancel": "stop",
                "process.continue": "summarize"
            }
        },
        summarize: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleSummary(),
                    nextButtonTitle: "Use 1 invite credit",
                    canGoBack: true,
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerSummary()
                        }
                    },
                    artifacts: Object.assign(Object.assign({}, ethereumAddress("recipient", str.titleRecipient(), true)), inviteCredits("value", str.titleValue()))
                };
            }),
            on: {
                "process.back": "intro",
                "process.cancel": "stop",
                "process.continue": "transferJumpstartXDai"
            }
        },
        transferJumpstartXDai: {
            entry: sendInProgressPrompt(str.titleProgress),
            invoke: {
                id: 'transferJumpstartXDai',
                src: transferJumpstartXDaiService,
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
export const jumpstart = {
    name: "jumpstart",
    stateMachine: processDefinition
};
