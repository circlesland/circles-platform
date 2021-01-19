import {createMachine, send} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {strings} from "../../data/strings";
import {ConnectSafeContext, importCircles} from "../omo/importCircles";
import {signupAtCircles} from "../omo/signupAtCircles";
import {createPrivateKey} from "../omo/createPrivateKey";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt, sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {choice} from "omo-process/dist/artifacts/choice";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {RunProcess} from "omo-process/dist/events/runProcess";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {transferCircles} from "../circles/transferCircles";
import {config} from "omo-circles/dist/config";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";

export interface InitialMenuContext extends ProcessContext {
  data: {
    menuChoice?: ProcessArtifact,
  }
}

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
      entry: <any>sendPrompt((context) => {
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
          target: 'signupAtCircles',
          cond: (context) => context.data.menuChoice.value === str.choice_justWantToJoin()
        }],
        "process.cancel": "stop"
      }
    },
    importCircles: {
      entry: <any>[
        sendShellEvent(new RunProcess<ConnectSafeContext>(importCircles)),
        send({
          type: "process.triggerSelf"
        })
      ],
      on: {
        "process.triggerSelf": "stop"
      }
    },
    signupAtCircles: {
      entry:<any> [
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
export const initialMenu: ProcessDefinition = {
  name: "initialMenu",
  stateMachine: <any>processDefinition
};

