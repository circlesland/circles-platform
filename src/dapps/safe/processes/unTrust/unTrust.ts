import { createMachine } from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { strings } from "../../data/strings";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {unTrustService} from "./services/unTrustService";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {sendPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {ethereumAddress} from "../../../../libs/o-processes/artifacts/ethereumAddress";

export interface UnTrustContext extends ProcessContext {
  data: {
    trustReceiver: ProcessArtifact
  }
}

/**
 * Set trust
 */
const str = strings.safe.processes.unTrust;
const processDefinition = () => createMachine<UnTrustContext, OmoEvent>({
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
        banner: {
          component: Banner,
          data: {
            text: str.bannerTrustRecipient()
          }
        },
        artifacts: {
          ... ethereumAddress("trustReceiver",str.titleTrustReceiver())
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
      entry: sendInProgressPrompt(str.titleWorking),
      invoke: {
        id: 'setTrust',
        src: unTrustService,
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

export const unTrust: ProcessDefinition = {
  name: "unTrust",
  stateMachine: processDefinition
};
