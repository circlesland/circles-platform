import {assign, createMachine} from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
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
import {createAccount} from "./actions/createAccount";

export interface CreateSafeContext extends ProcessContext {
  data: {
    account?: ProcessArtifact
  }
}

/**
 * Connect safe
 */
const str = strings.safe.processes.connectSafe;
/*
const processDefinition = () => createMachine<CreateSafeContext, OmoEvent>({
  initial: "createAccount",
  states: {
    createAccount: {
      entry: createAccount,
      on: {
        "process.continue": {
          target: ""
        }
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
        src: createSafeService,
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

export const createSafe: ProcessDefinition = {
  name: "connectSafe",
  stateMachine: processDefinition
};
*/
export const none = "";
