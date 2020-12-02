import { createMachine, send } from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import { OmoEvent } from "../../../../libs/o-events/omoEvent";
import { ProcessContext } from "../../../../libs/o-processes/interfaces/processContext";
import { ProcessArtifact } from "../../../../libs/o-processes/interfaces/processArtifact";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setResult } from "../../../../libs/o-processes/actions/setResult";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { strings } from "../../data/strings";
import { textLine } from "../../../../libs/o-processes/artifacts/textLine";
import { file } from "../../../../libs/o-processes/artifacts/file";
import {addOrUpdateMyProfileService} from "../createOmoSapien/services/addOrUpdateMyProfileService";
import {RefreshView} from "../../../../libs/o-events/refreshView";

export interface UpdateOmoSapienContext extends ProcessContext {
  data: {
    firstName?: ProcessArtifact,
    lastName?: ProcessArtifact,
    avatar?: ProcessArtifact,
    safeChoice?: ProcessArtifact
  }
}

/**
 * Connect safe
 */
const str = strings.omosapien.processes.createOmoSapien;
const processDefinition = () => createMachine<UpdateOmoSapienContext, OmoEvent | { type: "evaluateChoice" }>({
  initial: "idle",
  states: {

    idle: {
      on: {
        "process.continue": "promptFirstName"
      }
    },
    promptFirstName: {
      entry: sendPrompt({
        title: str.titleFirstName(),
        nextButtonTitle: str.buttonFirstName(),
        banner: {
          component: Banner,
          data: {
            text: str.bannerFirstName()
          }
        },
        artifacts: {
          ...textLine("firstName", undefined, undefined, false)
        }
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
      entry: sendPrompt({
        canGoBack: true,
        title: str.titleLastName(),
        nextButtonTitle: str.buttonLastName(),
        banner: {
          component: Banner,
          data: {
            text: str.bannerLastName()
          }
        },
        artifacts: {
          ...textLine("lastName", undefined, undefined, true)
        }
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
      entry: sendPrompt({
        canGoBack: true,
        title: str.titleAvatar(),
        nextButtonTitle: str.buttonAvatar(),
        banner: {
          component: Banner,
          data: {
            text: str.bannerAvatar()
          }
        },
        artifacts: {
          ...file("avatar", undefined, undefined, true)
        }
      }),
      on: {
        "process.back": {
          target: "promptLastName"
        },
        "process.continue": {
          actions: storePromptResponse,
          target: "updateOmoSapien"
        },
        "process.cancel": "stop"
      }
    },
    updateOmoSapien: {
      entry: sendInProgressPrompt(str.bannerProgress),
      invoke: {
        id: 'updateOmoSapien',
        src: addOrUpdateMyProfileService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: [
            setResult(str.successMessage)
          ],
          target: "stop"
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
    stop: {
      type: "final"
    }
  }
});

export const updateOmoSapien: ProcessDefinition = {
  name: "updateOmoSapien",
  stateMachine: processDefinition
};
