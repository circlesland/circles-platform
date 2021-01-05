import { strings } from "../../data/strings";
import { createMachine } from "xstate";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import { ethereumAddress } from "../../../../libs/o-processes/artifacts/ethereumAddress";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { connectSafeService } from "../../services/connectSafeService";
const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "promptSafeAddress"
            }
        },
        promptSafeAddress: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleSafeAddress(),
                    nextButtonTitle: str.buttonSafeAddress(),
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerSafeAddress()
                        }
                    },
                    artifacts: Object.assign({}, ethereumAddress("safeAddress"))
                };
            }),
            on: {
                "process.continue": {
                    actions: storePromptResponse,
                    target: "promptPrivateKey"
                },
                "process.cancel": "stop"
            }
        },
        promptPrivateKey: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleSeedPhrase(),
                    nextButtonTitle: "Connect safe",
                    canGoBack: true,
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerSeedPhrase()
                        }
                    },
                    artifacts: {
                        privateKey: {
                            key: "privateKey",
                            type: "keyphrase",
                        }
                    }
                };
            }),
            on: {
                "process.back": {
                    target: "promptSafeAddress"
                },
                "process.continue": {
                    actions: storePromptResponse,
                    target: "connectSafe"
                },
                "process.cancel": "stop"
            }
        },
        connectSafe: {
            entry: sendInProgressPrompt(str.titleProgress),
            invoke: {
                id: 'connectSafe',
                src: connectSafeService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(str.successConnectSafe),
                    target: "success"
                }
            }
        },
        success: {
            entry: sendSuccessPrompt,
            on: {
                "process.continue": "stop",
                "process.cancel": "stop"
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
export const importCircles = {
    name: "importCircles",
    stateMachine: processDefinition
};
