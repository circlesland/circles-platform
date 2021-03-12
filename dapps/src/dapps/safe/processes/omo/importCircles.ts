import {strings} from "../../data/strings";
import {createMachine} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {connectSafeService} from "../../services/connectSafeService";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
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
const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<ConnectSafeContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "promptSafeAddress"
      }
    },
    promptSafeAddress: {
      entry: <any>sendPrompt((context) => {
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
          actions: <any>storePromptResponse,
          target: "promptPrivateKey"
        },
        "process.cancel": "stop"
      }
    },
    promptPrivateKey: {
      entry: <any>sendPrompt((context) => {
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
          actions: <any>storePromptResponse,
          target: "connectSafe"
        },
        "process.cancel": "stop"
      }
    },
    connectSafe: {
      entry: <any>sendInProgressPrompt(progressView, str.titleProgress),
      invoke: <any>{
        id: 'connectSafe',
        src: connectSafeService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successConnectSafe),
          target: "success"
        }
      }
    },
    success: {
      entry: <any>sendSuccessPrompt(successView),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
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

export const importCircles: ProcessDefinition<any,any> = {
  name: "importCircles",
  stateMachine: <any>processDefinition
};
