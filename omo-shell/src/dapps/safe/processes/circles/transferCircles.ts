import { createMachine} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {strings} from "../../data/strings";
import {transferCirclesService} from "../../services/transferCirclesService";
import Web3 from "omo-quirks/dist/web3";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt, sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {ethereumAddress} from "omo-process/dist/artifacts/ethereumAddress";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {o} from "omo-process/dist/artifacts/o";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";

export interface TransferCirclesContext extends ProcessContext {
  web3:Web3;
  //  myBalance: BN;
  circlesHub:CirclesHub;
  data: {
    recipient?: ProcessArtifact,
    value?: ProcessArtifact
  }
}

const str = strings.safe.processes.transferCircles;
const processDefinition = (maxBalance: number, progressView:any, successView:any, errorView:any) => createMachine<TransferCirclesContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "promptRecipient"
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
          target: "promptValue"
        },
        "process.cancel": "stop"
      }
    },
    promptValue: {
      entry: <any>sendPrompt((context) => {
        return {
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
            ...o("value", undefined, undefined, maxBalance)
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptRecipient"
        },
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "summarize"
        },
        "process.cancel": "stop"
      }
    },
    summarize: {
      entry: <any>sendPrompt((context) => {
        return {
          title: str.titleSummary(),
          nextButtonTitle: "Transfer ⦿",
          canGoBack: true,
          banner: {
            component: Banner,
            data: {
              text: str.bannerSummary()
            }
          },
          artifacts: {
            ...ethereumAddress("recipient", str.titleRecipient(), true),
            ...o("value", str.titleValue(), true)
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptValue"
        },
        "process.cancel": "stop",
        "process.continue": "transferCircles"
      }
    },
    transferCircles: {
      entry: <any>[
        sendInProgressPrompt(progressView, str.titleProgress),
        sendShellEvent({
          type: "shell.closeModal"
        })
      ],
      invoke: <any>{
        id: 'transferCircles',
        src: transferCirclesService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successMessage),
          target: "stop"
        }
      }
    },
    success: {
      entry: <any>sendSuccessPrompt(successView),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      },
      after: {
        2000: { target: 'stop' }
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

export const transferCircles: ProcessDefinition = {
  name: "transferCircles",
  stateMachine: <any>processDefinition
};
