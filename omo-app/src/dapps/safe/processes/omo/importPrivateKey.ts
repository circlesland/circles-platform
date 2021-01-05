import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {createMachine} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {strings} from "../../data/strings";
import {sendPrompt, sendShellEvent} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {RunProcess} from "../../../../libs/o-events/runProcess";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setProcessResult} from "../../../../libs/o-processes/actions/setProcessResult";
import {importPrivateKeyService} from "../../services/importPrivateKeyService";
import {fundAccountForSafeCreation} from "./fundAccountForSafeCreation";

export interface ImportPrivateKeyContext extends ProcessContext {
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
      entry: sendPrompt((context) => {
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
      entry: sendInProgressPrompt(str.progressImportAccount),
      invoke: {
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
      entry: sendShellEvent(new RunProcess(fundAccountForSafeCreation)),
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
  stateMachine: processDefinition
};

