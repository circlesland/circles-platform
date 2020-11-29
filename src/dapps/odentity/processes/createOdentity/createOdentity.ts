import { createMachine } from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import { push } from "svelte-spa-router";
import { OmoEvent } from "../../../../libs/o-events/omoEvent";
import { ProcessContext } from "../../../../libs/o-processes/interfaces/processContext";
import { ProcessArtifact } from "../../../../libs/o-processes/interfaces/processArtifact";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setResult } from "../../../../libs/o-processes/actions/setResult";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {strings} from "../../data/strings";
import {textLine} from "../../../../libs/o-processes/artifacts/textLine";
import {createOdentityService} from "./services/createOdentityService";
import {file} from "../../../../libs/o-processes/artifacts/file";

export interface CreateOdentityContext extends ProcessContext {
  data: {
    firstName?: ProcessArtifact,
    lastName?: ProcessArtifact,
    avatar?: ProcessArtifact
  }
}

/**
 * Connect safe
 */
const str = strings.odentity.processes.createOdentity;
const processDefinition = () => createMachine<CreateOdentityContext, OmoEvent>({
  initial: "ready",
  states: {
    ready: {
      on: {
        "process.continue": "promptFirstName",
        "process.cancel": "stop"
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
          ...textLine("firstName")
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
        title: str.titleLastName(),
        nextButtonTitle: str.buttonLastName(),
        banner: {
          component: Banner,
          data: {
            text: str.bannerLastName()
          }
        },
        artifacts: {
          ...textLine("lastName")
        }
      }),
      on: {
        "process.continue": {
          actions: storePromptResponse,
          target: "promptAvatar"
        },
        "process.cancel": "stop"
      }
    },
    promptAvatar: {
      entry: sendPrompt({
        title: str.titleAvatar(),
        nextButtonTitle: str.buttonAvatar(),
        banner: {
          component: Banner,
          data: {
            text: str.bannerAvatar()
          }
        },
        artifacts: {
          ...file("avatar")
        }
      }),
      on: {
        "process.continue": {
          actions: storePromptResponse,
          target: "createOdentity"
        },
        "process.cancel": "stop"
      }
    },
    createOdentity: {
      entry: sendInProgressPrompt(str.bannerProgress),
      invoke: {
        id: 'createOdentity',
        src: createOdentityService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setResult(str.successMessage),
          target: "success"
        }
      }
    },
    success: {
      type: "final",
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

export const createOdentity: ProcessDefinition = {
  name: "createOdentity",
  stateMachine: processDefinition
};
