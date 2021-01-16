import { createMachine} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import { strings } from "../../data/strings";
import { addOrUpdateMyProfileService } from "./services/addOrUpdateMyProfileService";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt, sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {textLine} from "omo-process/dist/artifacts/textLine";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {file} from "omo-process/dist/artifacts/file";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {NavigateTo} from "omo-events/dist/shell/navigateTo";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface CreateOmoSapienContext extends ProcessContext {
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
const processDefinition = () => createMachine<CreateOmoSapienContext, OmoEvent | { type: "evaluateChoice" }>({
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
          artifacts: {
            ...textLine("firstName", undefined, undefined, false)
          }
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
      entry: [
        sendSuccessPrompt,
        sendShellEvent(new NavigateTo("/safe/transactions"))
      ],
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      },
      after: {
        2000: { target: 'stop' }
      }
    },
    stop: {
      type: "final"
    }
  }
});

export const createOmoSapien: ProcessDefinition = {
  name: "createOmoSapien",
  stateMachine: processDefinition
};
