import { createMachine } from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { connectSafeService } from "./services/connectSafeService";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import { push } from "svelte-spa-router";
import { OmoEvent } from "../../../../libs/o-events/omoEvent";
import { ProcessContext } from "../../../../libs/o-processes/interfaces/processContext";
import { ProcessArtifact } from "../../../../libs/o-processes/interfaces/processArtifact";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setResult } from "../../../../libs/o-processes/actions/setResult";
import { strings } from "../../data/strings";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { ethereumAddress } from "../../../../libs/o-processes/artifacts/ethereumAddress";

export interface ConnectSafeContext extends ProcessContext {
  data: {
    safeAddress?: ProcessArtifact,
    privateKey?: ProcessArtifact
  }
}

/**
 * Connect safe
 */
const str = strings.safe.processes.connectSafe;
const processDefinition = () => createMachine<ConnectSafeContext, OmoEvent>({
  initial: "ready",
  states: {
    ready: {
      on: {
        "process.continue": "promptSafeAddress",
        "process.cancel": "stop"
      }
    },
    promptSafeAddress: {
      entry: sendPrompt({
        title: str.titleSafeAddress(),
        nextButtonTitle: str.buttonSafeAddress(),
        banner: {
          component: Banner,
          data: {
            text: str.bannerSafeAddress()
          }
        },
        artifacts: {
          ...ethereumAddress("safeAddress")
        }
      }),
      on: {
        "process.continue": {
          actions: storePromptResponse,
          target: "promptPrivateKey"
        },
        "process.cancel": "stop"
      }
    },
    promptPrivateKey: {
      entry: sendPrompt({
        title: str.titleSeedPhrase(),
        nextButtonTitle: "Connect safe",
        canGoBack: true,
        banner: {
          component: Banner,
          data: {
            text: str.bannerSeedPhrase()
          }
        },
        artifacts: {
          privateKey: {
            key: "privateKey",
            type: "keyphrase",
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptSafeAddress"
        },
        "process.continue": {
          actions: storePromptResponse,
          target: "connectSafe"
        },
        "process.cancel": "stop"
      }
    },
    connectSafe: {
      entry: sendInProgressPrompt(str.titleProgress),
      invoke: {
        id: 'connectSafe',
        src: connectSafeService,
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
      entry: () => push('#/safe/transactions')
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

export const connectSafe: ProcessDefinition = {
  name: "connectSafe",
  stateMachine: processDefinition
};
