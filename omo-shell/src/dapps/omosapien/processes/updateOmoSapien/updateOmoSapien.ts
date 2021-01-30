import { createMachine, send } from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import { strings } from "../../data/strings";
import { addOrUpdateMyProfileService } from "../createOmoSapien/services/addOrUpdateMyProfileService";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {textLine} from "omo-process/dist/artifacts/textLine";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {file} from "omo-process/dist/artifacts/file";

export interface UpdateOmoSapienContext extends ProcessContext {
  data: {
    firstName?: ProcessArtifact,
    lastName?: ProcessArtifact,
    avatar?: ProcessArtifact,
    safeChoice?: ProcessArtifact
  }
}

const str = strings.omosapien.processes.createOmoSapien;
const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<UpdateOmoSapienContext, OmoEvent>({
  initial: "idle",
  states: {

    idle: {
      on: {
        "process.continue": "promptFirstName"
      }
    },
    promptFirstName: {
      entry: <any>sendPrompt((context) => {
        return {
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
        }
      }),
      on: {
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "promptLastName"
        },
        "process.cancel": "stop"
      }
    },
    promptLastName: {
      entry: <any>sendPrompt((context) => {
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
          artifacts: {
            ...textLine("lastName", undefined, undefined, true)
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptFirstName"
        },
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "promptAvatar"
        },
        "process.cancel": "stop"
      }
    },
    promptAvatar: {
      entry: <any>sendPrompt((context) => {
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
          artifacts: {
            ...file("avatar", undefined, undefined, true)
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptLastName"
        },
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "updateOmoSapien"
        },
        "process.cancel": "stop"
      }
    },
    updateOmoSapien: {
      entry: <any>sendInProgressPrompt(progressView, str.bannerProgress),
      invoke: <any>{
        id: 'updateOmoSapien',
        src: addOrUpdateMyProfileService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: [
            setProcessResult(str.successMessage)
          ],
          target: "stop"
        }
      }
    },
    error: {
      entry: <any>sendErrorPrompt(errorView),
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
  stateMachine: <any>processDefinition
};
