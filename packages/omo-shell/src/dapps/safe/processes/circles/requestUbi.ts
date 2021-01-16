import { createMachine } from "xstate";
import { strings } from "../../data/strings";
import {requestUbiService} from "../../services/requestUbiService";
import Web3 from "web3";
import {ProcessContext} from "omo-process/dist/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {OmoSafeState} from "../../manifest";


export interface RequestUbiContext extends ProcessContext {
  web3:Web3;
  safeState:OmoSafeState;
  data: {
  }
}

/**
 * Requests UBI
 */
const str = strings.safe.processes.requestUbi;
const processDefinition = () => createMachine<RequestUbiContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "requestUbi"
      }
    },
    requestUbi: {
      entry: [
        sendInProgressPrompt(str.titleProgress),
        sendShellEvent({
          type: "shell.closeModal"
        })
      ],
      invoke: {
        id: 'requestingUbi',
        src: requestUbiService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successMessage),
          target: "stop"
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
        2000: { target: 'stop' }
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
