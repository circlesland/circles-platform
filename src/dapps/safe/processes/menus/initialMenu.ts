import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {createMachine, send} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {sendPrompt, sendShellEvent} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import {choice} from "../../../../libs/o-processes/artifacts/choice";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {RunProcess} from "../../../../libs/o-events/runProcess";
import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import {strings} from "../../data/strings";
import {importCircles} from "../omo/importCircles";
import {importPrivateKey} from "../omo/importPrivateKey";
import {signupAtCircles} from "../omo/signupAtCircles";

export interface InitialMenuContext extends ProcessContext {
  data: {
    menuChoice?: ProcessArtifact,
  }
}

/**
 * Connect safe
 */
const str = strings.safe.processes.intiialMenu;
const processDefinition = () => createMachine<InitialMenuContext, OmoEvent>({
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
          artifacts: {
            ...choice("menuChoice", undefined, [
              str.choice_alreadyGotCircles(),
              str.choice_wantToReuseMyExistingPrivateKey(),
              str.choice_justWantToJoin()])
          }
        }
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
          target: 'importPrivateKey',
          cond: (context) => context.data.menuChoice.value === str.choice_wantToReuseMyExistingPrivateKey()
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
    importPrivateKey: {
      entry: [
        sendShellEvent(new RunProcess(importPrivateKey)),
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
        sendShellEvent(new RunProcess(signupAtCircles)),
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
export const initialMenu: ProcessDefinition = {
  name: "initialMenu",
  stateMachine: processDefinition
};

