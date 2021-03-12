import { createMachine, send } from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import {strings} from "../../data/strings";
import {setTrustService} from "../../services/setTrustService";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";
import Web3 from "omo-quirks/dist/web3";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {ethereumAddress} from "omo-process/dist/artifacts/ethereumAddress";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface SetTrustContext extends ProcessContext {
  web3:Web3;
  circlesHub:CirclesHub;
  data: {
    trustReceiver: ProcessArtifact
  }
}

/**
 * Set trust
 */
const str = strings.safe.processes.setTrust;
const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<SetTrustContext, OmoEvent>({
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
          nextButtonTitle: "Trust",
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
      entry: <any>sendInProgressPrompt(progressView, str.titleWorking),
      invoke: <any>{
        id: 'setTrust',
        src: setTrustService,
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

export const setTrust: ProcessDefinition<any,any> = {
  name: "setTrust",
  stateMachine: <any>processDefinition
};
