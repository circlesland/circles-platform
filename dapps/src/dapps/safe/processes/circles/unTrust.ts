import { createMachine} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import {strings} from "../../data/strings";
import {unTrustService} from "../../services/unTrustService";
import Web3 from "omo-quirks/dist/web3";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {ethereumAddress} from "omo-process/dist/artifacts/ethereumAddress";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";

export interface UnTrustContext extends ProcessContext {
  web3:Web3;
  circlesHub:CirclesHub;
  data: {
    trustReceiver: ProcessArtifact
  }
}

const str = strings.safe.processes.unTrust;
const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<UnTrustContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "promptTrustReceiver"
      }
    },
    promptTrustReceiver: {
      entry: <any>sendPrompt((context) => {
        return {
          title: str.titleTrustReceiver(),
          nextButtonTitle: "Revoke trust",
          banner: {
            component: Banner,
            data: {
              text: str.bannerTrustRecipient()
            }
          },
          artifacts: {
            ...ethereumAddress("trustReceiver", null, false, true)
          }
        }
      }),
      on: {
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "setTrust"
        },
        "process.cancel": "stop"
      }
    },
    setTrust: {
      entry:<any> [
        sendInProgressPrompt(progressView, str.titleWorking),
        /*sendShellEvent({
          type: "shell.closeModal"
        })*/
      ],
      invoke: <any>{
        id: 'setTrust',
        src: unTrustService,
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
}, {
  guards: {
    "isFullyConfigured": (context => !!context.data.trustReceiver && !!context.data.trustReceiver.value)
  }
});

export const unTrust: ProcessDefinition<any,any> = {
  name: "unTrust",
  stateMachine:<any> processDefinition
};
