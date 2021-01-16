import {createMachine} from "xstate";
import {strings} from "../../data/strings";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {importPrivateKeyService} from "../../services/importPrivateKeyService";
import {fundAccountForSafeCreation} from "./fundAccountForSafeCreation";
import Web3 from "omo-quirks/dist/web3";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt, sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {RunProcess} from "omo-process/dist/events/runProcess";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface ImportPrivateKeyContext extends ProcessContext {
  web3:Web3;
  data: {
    privateKey?: ProcessArtifact
    privateKeyPhrase?: ProcessArtifact
  }
}

const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine<ImportPrivateKeyContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "promptPrivateKey"
      }
    },
    promptPrivateKey: {
      entry: <any>sendPrompt((context) => {
        return {
          title: str.titleSeedPhrase(),
          nextButtonTitle: "Import",
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
        "process.continue": {
          actions: storePromptResponse,
          target: "importAccount"
        },
        "process.cancel": "stop"
      }
    },
    importAccount: {
      entry:<any> sendInProgressPrompt(str.progressImportAccount),
      invoke: <any>{
        id: 'importAccount',
        src: importPrivateKeyService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successImportAccount),
          target: "success"
        }
      }
    },
    success: {
      entry:<any> sendShellEvent(new RunProcess(fundAccountForSafeCreation)),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      },
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

export const importPrivateKey: ProcessDefinition = {
  name: "importPrivateKey",
  stateMachine: <any>processDefinition
};

