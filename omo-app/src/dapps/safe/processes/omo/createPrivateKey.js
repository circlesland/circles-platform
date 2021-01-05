import { strings } from "../../data/strings";
import { createMachine } from "xstate";
import { sendPrompt, sendShellEvent } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { RunProcess } from "../../../../libs/o-events/runProcess";
import { createPrivateKeyService } from "../../services/createPrivateKeyService";
import { fundAccountForSafeCreation } from "../omo/fundAccountForSafeCreation";
import { keyphrase } from "../../../../libs/o-processes/artifacts/keyphrase";
const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "createPrivateKey"
            }
        },
        createPrivateKey: {
            entry: sendInProgressPrompt(str.progressCreatePrivateKey),
            invoke: {
                id: 'createPrivateKey',
                src: createPrivateKeyService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(str.successCreatePrivateKey),
                    target: "exportPassphrase"
                }
            }
        },
        exportPassphrase: {
            entry: sendPrompt((context) => {
                return {
                    title: str.titleBackupKey(),
                    nextButtonTitle: str.buttonBackupKey(),
                    banner: {
                        component: Banner,
                        data: {
                            text: str.bannerBackupKey()
                        }
                    },
                    artifacts: Object.assign({}, keyphrase("privateKeyPhrase", undefined, true))
                };
            }),
            on: {
                "process.continue": "success"
            }
        },
        success: {
            entry: sendShellEvent(new RunProcess(fundAccountForSafeCreation)),
            on: {
                "process.continue": "stop",
                "process.cancel": "stop"
            },
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
export const createPrivateKey = {
    name: "createPrivateKey",
    stateMachine: processDefinition
};
