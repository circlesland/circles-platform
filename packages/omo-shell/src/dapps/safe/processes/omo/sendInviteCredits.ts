import {createMachine, send} from "xstate";
import {strings} from "../../data/strings";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {sendInviteCreditsService} from "../../services/sendInviteCreditsService";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {ethereumAddress} from "omo-process/dist/artifacts/ethereumAddress";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {inviteCredits} from "omo-process/dist/artifacts/inviteCredits";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {setError} from "omo-process/dist/actions/setError";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import Web3 from "omo-quirks/dist/web3";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface SendInviteCreditsContext extends ProcessContext
{
  web3: Web3,
  data: {
    recipient?: ProcessArtifact,
    value?: ProcessArtifact
  }
}

/**
 * Transfer xDai
 */
const str = strings.safe.processes.sendInviteCredits;
const processDefinition = () => createMachine<SendInviteCreditsContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on:{
        "process.continue": "promptRecipient"
      }
    },
    promptRecipient: {
      entry: <any>sendPrompt((context:SendInviteCreditsContext) => {
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
          actions: storePromptResponse,
          target: "promptValue"
        },
        "process.cancel": "stop"
      }
    },
    promptValue: {
      entry: <any>sendPrompt((context) => {return{
        title: str.titleValue(),
        nextButtonTitle: "Next",
        canGoBack: true,
        banner: {
          component: Banner,
          data: {
            text: str.bannerValue()
          }
        },
        artifacts: {
          ...inviteCredits("value")
        }
      }}),
      on: {
        "process.back": {
          target: "promptRecipient"
        },
        "process.continue": {
          actions: storePromptResponse,
          target: "summarize"
        },
        "process.cancel": "stop"
      }
    },
    summarize: {
      entry: <any>sendPrompt((context) => {return{
        title: str.titleSummary(),
        nextButtonTitle: "Transfer xDai",
        canGoBack: true,
        banner: {
          component: Banner,
          data: {
            text: str.bannerSummary()
          }
        },
        artifacts: {
          ...ethereumAddress("recipient", str.titleRecipient(), true),
          ...inviteCredits("value", str.titleValue(), true)
        }
      }}),
      on: {
        "process.back": {
          target: "promptValue"
        },
        "process.cancel": "stop",
        "process.continue": "transferXDai"
      }
    },
    transferXDai: {
      entry: <any>sendInProgressPrompt(str.titleProgress),
      invoke: <any>{
        id: 'transferXDai',
        src: sendInviteCreditsService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successMessage),
          target: "success"
        }
      }
    },
    success: {
      entry: sendSuccessPrompt,
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

export const sendInviteCredits: ProcessDefinition = {
  name: "sendInviteCredits",
  stateMachine: <any>processDefinition
};
