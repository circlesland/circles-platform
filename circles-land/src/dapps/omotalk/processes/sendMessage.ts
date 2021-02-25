import { createMachine} from "xstate";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {sendMessageService} from "../services/sendMessageService";
import {strings} from "../data/strings";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import Banner from "../../../libs/o-views/atoms/Banner.svelte";
import {ethereumAddress} from "omo-process/dist/artifacts/ethereumAddress";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {text} from "omo-process/dist/artifacts/text";
import {Client} from "omo-central-client/dist/omoCentralClient";
import {textLine} from "omo-process/dist/artifacts/textLine";

export interface SendMessageContext extends ProcessContext {
  omoCentral: Client,
  namespace: string,
  topic: string,
  data: {
    recipient?: ProcessArtifact,
    preview?: ProcessArtifact,
    text?: ProcessArtifact
  }
}

/**
 * Connect safe
 */
const str = strings.omotalk.processes.sendMessage;
const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<SendMessageContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": [{
          target: "promptRecipient",
          cond: (context) => !context.data?.recipient?.value
        },{
          target: "promptText",
          cond: (context) => context.data?.recipient?.value
        }]
      }
    },
    promptRecipient: {
      entry: <any>sendPrompt((context) => {
        return {
          title: str.titleRecipient(),
          nextButtonTitle: "Next",
          banner: {
            component: Banner,
            data: {
              text: str.bannerRecipient()
            }
          },
          artifacts: {
            ...ethereumAddress("recipient", null, false, true)
          }
        }
      }),
      on: {
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "promptText"
        },
        "process.cancel": "stop"
      }
    },
    promptText: {
      entry: <any>sendPrompt((context) => {
        return {
          title: str.titlePromptText(),
          nextButtonTitle: str.buttonSend(),
          canGoBack: true,
          banner: {
            component: Banner,
            data: {
              text: str.bannerPromptText()
            }
          },
          artifacts: {
            ...textLine("preview", "Subject", undefined, false),
            ...text("text", "Message", undefined, false)
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptRecipient"
        },
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "sendMessage"
        },
        "process.cancel": "stop"
      }
    },
    sendMessage: {
      entry:<any> sendInProgressPrompt(progressView, str.bannerProgress),
      invoke: <any>{
        id: 'sendMessage',
        src: sendMessageService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(strings.omotalk.processes.sendMessage.successMessage),
          target: "success"
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
    success: {
      entry: <any>sendSuccessPrompt(successView),
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

export const sendMessage: ProcessDefinition = {
  name: "sendMessage",
  stateMachine:<any> processDefinition
};
