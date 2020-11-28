import {createMachine} from "xstate";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {strings} from "../../data/strings";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {getUbi} from "./getUbi";
import {sendErrorPrompt, sendInProgress, sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";

/**
 * Requests UBI
 */
const str = strings.safe.processes.requestUbi;
const processDefinition = () => createMachine<ProcessContext, OmoEvent>({
  initial: "ready",
  states: {
    ready: {
      on: {
        "process.continue": {
          target: "requestUbi"
        },
        "process.cancel": "stop",
      }
    },
    requestUbi: {
      entry: sendInProgress(str.titleProgress),
      invoke: {
        id: 'requestingUbi',
        src: getUbi,
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
      entry: sendSuccessPrompt,
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      },
      after: {
        2000: {target: 'stop'}
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

export const requestUbi: ProcessDefinition = {
  name: "requestUbi",
  stateMachine: processDefinition
};
