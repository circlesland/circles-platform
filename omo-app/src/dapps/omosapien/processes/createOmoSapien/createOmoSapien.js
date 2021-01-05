import { createMachine } from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { strings } from "../../data/strings";
import { textLine } from "../../../../libs/o-processes/artifacts/textLine";
import { addOrUpdateMyProfileService } from "./services/addOrUpdateMyProfileService";
import { file } from "../../../../libs/o-processes/artifacts/file";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
/**
 * Connect safe
 */
const str = strings.omosapien.processes.createOmoSapien;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "promptFirstName"
            }
        },
        promptFirstName: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleFirstName(),
                    nextButtonTitle: str.buttonFirstName(),
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerFirstName()
                        }
                    },
                    artifacts: Object.assign({}, textLine("firstName", undefined, undefined, false))
                };
            }),
            on: {
                "process.continue": {
                    actions: storePromptResponse,
                    target: "promptLastName"
                },
                "process.cancel": "stop"
            }
        },
        promptLastName: {
            entry: sendPrompt((context) => {
                return {
                    canGoBack: true,
                    title: str.titleLastName(),
                    nextButtonTitle: str.buttonLastName(),
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerLastName()
                        }
                    },
                    artifacts: Object.assign({}, textLine("lastName", undefined, undefined, true))
                };
            }),
            on: {
                "process.back": {
                    target: "promptFirstName"
                },
                "process.continue": {
                    actions: storePromptResponse,
                    target: "promptAvatar"
                },
                "process.cancel": "stop"
            }
        },
        promptAvatar: {
            entry: sendPrompt((context) => {
                return {
                    canGoBack: true,
                    title: str.titleAvatar(),
                    nextButtonTitle: str.buttonAvatar(),
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerAvatar()
                        }
                    },
                    artifacts: Object.assign({}, file("avatar", undefined, undefined, true))
                };
            }),
            on: {
                "process.back": {
                    target: "promptLastName"
                },
                "process.continue": {
                    actions: storePromptResponse,
                    target: "createOmoSapien"
                },
                "process.cancel": "stop"
            }
        },
        createOmoSapien: {
            entry: sendInProgressPrompt(str.bannerProgress),
            invoke: {
                id: 'createOmoSapien',
                src: addOrUpdateMyProfileService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(strings.omosapien.processes.createOmoSapien.successMessage),
                    target: "success"
                }
            }
        },
        error: {
            entry: sendErrorPrompt,
            on: {
                "process.continue": "stop",
                "process.cancel": "stop"
            }
        },
        success: {
            entry: sendSuccessPrompt,
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
export const createOmoSapien = {
    name: "createOmoSapien",
    stateMachine: processDefinition
};
