import {strings} from "../../data/strings";
import {createMachine} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {createPrivateKeyService} from "../../services/createPrivateKeyService";
import {fundAccountForSafeCreation} from "../omo/fundAccountForSafeCreation";
import Web3 from "web3";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendPrompt, sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {keyphrase} from "omo-process/dist/artifacts/keyphrase";
import {RunProcess} from "omo-process/dist/events/runProcess";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface CreatePrivateKeyContext extends ProcessContext {
  web3:Web3;
  data: {
    privateKey?: ProcessArtifact
    privateKeyPhrase?: ProcessArtifact
  }
}

const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine<CreatePrivateKeyContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "createPrivateKey"
      }
    },
    createPrivateKey: {
      entry: sendInProgressPrompt(str.progressCreatePrivateKey),
      invoke: {
        id: 'createPrivateKey',
        src: createPrivateKeyService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successCreatePrivateKey),
          target: "exportPassphrase"
        }
      }
    },
    exportPassphrase: {
      entry: sendPrompt((context) => {
        return {
          title: str.titleBackupKey(),
          nextButtonTitle: str.buttonBackupKey(),
          banner: {
            component: Banner,
            data: {
              text: str.bannerBackupKey()
            }
          },
          artifacts: {
            ...keyphrase("privateKeyPhrase", undefined, true)
          }
        }
      }),
      on: {
        "process.continue": "success"
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

export const createPrivateKey: ProcessDefinition = {
  name: "createPrivateKey",
  stateMachine: processDefinition
};

