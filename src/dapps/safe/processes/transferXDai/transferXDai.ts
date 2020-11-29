import {createMachine, send} from "xstate";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {transferXDaiService} from "./services/transferXDaiService";
import {strings} from "../../data/strings";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {sendPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {ethereumAddress} from "../../../../libs/o-processes/artifacts/ethereumAddress";
import {ether} from "../../../../libs/o-processes/artifacts/ether";
import {RefreshView} from "../../../../libs/o-events/refreshView";

export interface TransferXDaiContext extends ProcessContext
{
  data: {
    recipient?: ProcessArtifact,
    value?: ProcessArtifact
  }
}

/**
 * Transfer xDai
 */
const str = strings.safe.processes.transferXDai;
const processDefinition = () => createMachine<TransferXDaiContext, OmoEvent>({
  initial: "promptRecipient",
  states: {
    promptRecipient: {
      entry: sendPrompt({
        title: str.titleRecipient(),
        nextButtonTitle: "Next",
        banner: {
          component: Banner,
          data: {
            text: str.bannerRecipient()
          }
        },
        artifacts: {
          ...ethereumAddress("recipient")
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
      entry: sendPrompt({
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
          ...ether("value")
        }
      }),
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
      entry: sendPrompt({
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
          ...ether("value", str.titleValue(), true)
        }
      }),
      on: {
        "process.back": {
          target: "promptValue"
        },
        "process.cancel": "stop",
        "process.continue": "transferXDai"
      }
    },
    transferXDai: {
      entry: sendInProgressPrompt(str.titleProgress),
      invoke: {
        id: 'transferXDai',
        src: transferXDaiService,
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
      entry: [
        sendSuccessPrompt,
        send({
          type: "process.shellEvent",
          payload: new RefreshView("safe.tokens")
        })
      ],
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

export const transferXDai: ProcessDefinition = {
  name: "transferXDai",
  stateMachine: processDefinition
};
