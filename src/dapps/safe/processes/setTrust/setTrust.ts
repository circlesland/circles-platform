import { createMachine } from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { strings } from "../../data/strings";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {setTrustService} from "./services/setTrustService";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {sendPrompt} from "../../../../libs/o-processes/actions/sendPrompt";
import { Jumper } from "svelte-loading-spinners";
import Error from "../../../../libs/o-views/atoms/Error.svelte"
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {Success} from "../../../../libs/o-processes/events/success";

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
        nextButtonTitle: "Next",
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
      entry: sendPrompt({title: str.titleWorking(), bannerComponent: Jumper, data:{} }),
      invoke: {
        id: 'setTrust',
        src: setTrustService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setResult,
          target: "success"
        }
      }
    },
    success: {
      entry: sendPrompt({title: "Success", bannerComponent: Success, data:{} }),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    error: {
      entry: sendPrompt({title: "Error", bannerComponent: Error, data:{} }),
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
  },
  actions: {
  }
});

export const setTrust: ProcessDefinition = {
  name: "setTrust",
  stateMachine: processDefinition
};
