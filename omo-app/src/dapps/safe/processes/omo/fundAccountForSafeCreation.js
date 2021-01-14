import { assign, createMachine } from "xstate";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { strings } from "../../data/strings";
import { textLine } from "../../../../libs/o-processes/artifacts/textLine";
import JumpstartIntro from "../../views/molecules/JumpstartIntro.svelte";
import { tryGetDappState } from "../../../../libs/o-os/loader";
import { config } from "../../../../libs/o-circles-protocol/config";
const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "generateFundLink"
            }
        },
        generateFundLink: {
            entry: [assign((context, event) => {
                    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
                    const fissionName = fissionAuthState.fission.getValue().payload.username;
                    const safeState = tryGetDappState("omo.safe:1");
                    const web3 = config.getCurrent().web3();
                    const myAccount = web3.eth.accounts.privateKeyToAccount(safeState.myKey.privateKey).address;
                    context.data.fundLink = {
                        type: "string",
                        key: "fundLink",
                        value: window.location.origin + "#/safe/empowerMe/" + myAccount + "/" + fissionName
                    };
                    return context;
                }),
                sendPrompt((context) => {
                    return {
                        title: str.titleGenerateFundLink(),
                        nextButtonTitle: str.buttonGenerateFundLink(),
                        hideNextButton: true,
                        banner: {
                            component: JumpstartIntro,
                            data: {
                                header: str.fundLinkHeader(),
                                subHeader: str.fundLinkSubHeader(),
                                body: str.fundLinkBody()
                            }
                        },
                        artifacts: Object.assign({}, textLine("fundLink", undefined, true))
                    };
                })],
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
export const fundAccountForSafeCreation = {
    name: "fundAccountForSafeCreation",
    stateMachine: processDefinition
};
