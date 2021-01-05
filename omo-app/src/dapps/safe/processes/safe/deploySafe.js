import { createMachine } from "xstate";
import { strings } from "../../data/strings";
import { BN } from "ethereumjs-util";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import { tryGetDappState } from "../../../../libs/o-os/loader";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { deploySafeService } from "../../services/deploySafeService";
import { sendSuccessPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
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
                    title: "Create a new safe?",
                    nextButtonTitle: "Next",
                    banner: {
                        component: Banner,
                        data: {
                            text: "Clicking 'Next' will create a new safe"
                        }
                    },
                    artifacts: {}
                };
            }),
            on: {
                "process.continue": [{
                        cond: (context) => {
                            var _a;
                            const safeState = tryGetDappState("omo.safe:1");
                            return ((_a = safeState.myAccountXDaiBalance) === null || _a === void 0 ? void 0 : _a.gte(new BN(context.environment.eth.web3.utils.toWei("0.02", "ether")))) === true;
                        },
                        target: "deploySafe"
                    }, {
                        target: "success"
                    }]
            }
        },
        deploySafe: {
            entry: sendInProgressPrompt(str.progressCreatePrivateKey),
            invoke: {
                id: 'deploySafe',
                src: deploySafeService,
                onError: {
                    actions: setError,
                    target: "error"
                },
                onDone: {
                    actions: setProcessResult(str.successDeploySafe),
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
export const deploySafe = {
    name: "deploySafe",
    stateMachine: processDefinition
};
