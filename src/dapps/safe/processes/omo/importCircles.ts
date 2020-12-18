import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {strings} from "../../data/strings";
import {createMachine} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import {sendPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {ethereumAddress} from "../../../../libs/o-processes/artifacts/ethereumAddress";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {connectSafeService} from "../../services/connectSafeService";

export interface ConnectSafeContext extends ProcessContext {
  data: {
    privateKey?: ProcessArtifact
    privateKeyPhrase?: ProcessArtifact
    safeAddress?: ProcessArtifact,
    fundLink?: ProcessArtifact,
    safeChoice?: ProcessArtifact,
    tokenAddress?: ProcessArtifact
  }
}


const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine<ConnectSafeContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "promptSafeAddress"
      }
    },
    promptSafeAddress: {
      entry: sendPrompt((context) => {
        return {
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
      entry: sendPrompt((context) => {
        return {
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
          actions: setResult(str.successConnectSafe),
          target: "success"
        }
      }
    },
    success: {
      entry: sendSuccessPrompt,
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
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

export const importCircles: ProcessDefinition = {
  name: "importCircles",
  stateMachine: processDefinition
};
