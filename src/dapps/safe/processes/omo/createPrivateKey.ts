import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {strings} from "../../data/strings";
import {createMachine} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import {sendPrompt, sendShellEvent} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {text} from "../../../../libs/o-processes/artifacts/text";
import {RunProcess} from "../../../../libs/o-events/runProcess";
import {createPrivateKeyService} from "../../services/createPrivateKeyService";
import {fundAccountForSafeCreation} from "../omo/fundAccountForSafeCreation";

export interface CreatePrivateKeyContext extends ProcessContext {
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
          actions: setResult(str.successCreatePrivateKey),
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
            ...text("privateKeyPhrase", undefined, true)
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

