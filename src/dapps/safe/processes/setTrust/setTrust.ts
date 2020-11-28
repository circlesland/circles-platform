import { createMachine } from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { strings } from "../../data/strings";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {setTrustService} from "./services/setTrustService";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {
  sendErrorPrompt,
  sendInProgress,
  sendPrompt,
  sendSuccessPrompt
} from "../../../../libs/o-processes/actions/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";

export interface SetTrustContext extends ProcessContext {
  data: {
    trustReceiver: ProcessArtifact
  }
}

/**
 * Set trust
 */
const str = strings.safe.processes.setTrust;
const processDefinition = () => createMachine<SetTrustContext, OmoEvent>({
  initial: "ready",
  states: {
    ready: {
      on: {
        "process.continue": [{
          cond: "isFullyConfigured",
          target: "setTrust"
        }, {
          target: "promptTrustReceiver"
        }],
        "process.cancel": "stop"
      }
    },
    promptTrustReceiver: {
      entry: sendPrompt({
        title: str.titleTrustReceiver(),
        nextButtonTitle: "Trust",
        bannerComponent: Banner,
        data: {
          trustReceiver: {
            key: "trustReceiver",
            type: "ethereumAddress",
            label: str.titleTrustReceiver()
          },
          banner: {
            key: "banner",
            type: "string",
            isHidden: true,
            value: str.bannerTrustRecipient()
          }
        }
      }),
      on: {
        "process.continue": {
          actions: storePromptResponse,
          target: "setTrust"
        },
        "process.cancel": "stop"
      }
    },
    setTrust: {
      entry: sendInProgress(str.titleWorking),
      invoke: {
        id: 'setTrust',
        src: setTrustService,
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
}, {
  guards: {
    "isFullyConfigured": (context => !!context.data.trustReceiver && !!context.data.trustReceiver.value)
  }
});

export const setTrust: ProcessDefinition = {
  name: "setTrust",
  stateMachine: processDefinition
};
