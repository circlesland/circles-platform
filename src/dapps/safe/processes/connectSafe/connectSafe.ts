import {createMachine} from "xstate";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {connectSafeService} from "./services/connectSafeService";
import { Jumper } from "svelte-loading-spinners";
import Error from "../../../../libs/o-views/atoms/Error.svelte"
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"

import {push} from "svelte-spa-router";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {sendPrompt} from "../../../../libs/o-processes/actions/sendPrompt";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {strings} from "../../data/strings";

export interface ConnectSafeContext extends ProcessContext
{
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
      entry: sendPrompt(str.titleSafeAddress(), {
        safeAddress: {
          key: "safeAddress",
          type: "ethereumAddress",
          label: str.titleSafeAddress()
        },
        banner: {
          key: "banner",
          type: "string",
          isHidden: true,
          value: str.bannerSafeAddress()
        }
      }, Banner),
      on: {
        "process.continue": {
          actions: storePromptResponse,
          target: "promptPrivateKey"
        },
        "process.cancel": "stop"
      }
    },
    promptPrivateKey: {
      entry: sendPrompt(str.titleSeedPhrase(), {
        privateKey: {
          key: "privateKey",
          type: "string",
          label: "Key phrase"
        },
        banner: {
          key: "banner",
          type: "string",
          isHidden: true,
          value: strings.safe.processes.connectSafe.bannerSeedPhrase()
        }
      }, Banner),
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
      entry: sendPrompt(str.titleProgress(), {}, Jumper),
      invoke: {
        id: 'connectSafe',
        src: connectSafeService,
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
      type: "final",
      entry: () => push('#/safe/transactions')
    },
    error: {
      entry: sendPrompt("Error", {}, Error),
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
