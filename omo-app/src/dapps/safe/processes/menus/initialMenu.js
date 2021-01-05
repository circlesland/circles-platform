import { createMachine, send } from "xstate";
import { sendPrompt, sendShellEvent } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { choice } from "../../../../libs/o-processes/artifacts/choice";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import { RunProcess } from "../../../../libs/o-events/runProcess";
import { strings } from "../../data/strings";
import { importCircles } from "../omo/importCircles";
import { createPrivateKey } from "../omo/createPrivateKey";
const str = strings.safe.processes.intiialMenu;
const processDefinition = () => createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "process.continue": "connectOrCreateSafe"
            }
        },
        connectOrCreateSafe: {
            entry: sendPrompt((context) => {
                return {
                    title: str.title_initialMenu(),
                    hideNextButton: true,
                    banner: {
                        component: Banner,
                        data: {
                            text: str.banner_initialMenu()
                        }
                    },
                    artifacts: Object.assign({}, choice("menuChoice", undefined, [
                        str.choice_alreadyGotCircles(),
                        str.choice_justWantToJoin()
                    ]))
                };
            }),
            on: {
                "process.continue": {
                    actions: [
                        storePromptResponse,
                        send({
                            type: "process.triggerSelf"
                        })
                    ]
                },
                "process.triggerSelf": [{
                        target: 'importCircles',
                        cond: (context) => context.data.menuChoice.value === str.choice_alreadyGotCircles()
                    }, {
                        target: 'signupAtCircles',
                        cond: (context) => context.data.menuChoice.value === str.choice_justWantToJoin()
                    }],
                "process.cancel": "stop"
            }
        },
        importCircles: {
            entry: [
                sendShellEvent(new RunProcess(importCircles)),
                send({
                    type: "process.triggerSelf"
                })
            ],
            on: {
                "process.triggerSelf": "stop"
            }
        },
        signupAtCircles: {
            entry: [
                sendShellEvent(new RunProcess(createPrivateKey)),
                send({
                    type: "process.triggerSelf"
                })
            ],
            on: {
                "process.triggerSelf": "stop"
            }
        },
        stop: {
            type: "final"
        }
    }
});
export const initialMenu = {
    name: "initialMenu",
    stateMachine: processDefinition
};
