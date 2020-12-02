import {createMachine, send} from "xstate";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {strings} from "../../data/strings";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {getUbi} from "./getUbi";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {RefreshView} from "../../../../libs/o-events/refreshView";

/**
 * Requests UBI
 */
const str = strings.safe.processes.requestUbi;
const processDefinition = () => createMachine<ProcessContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on:{
        "process.continue": "requestUbi"
      }
    },
    requestUbi: {
      entry: sendInProgressPrompt(str.titleProgress),
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
      entry: [
        sendSuccessPrompt,
        send({
          type: "process.shellEvent",
          payload: new RefreshView("safe.balance")
        }),
        send({
          type: "process.shellEvent",
          payload: new RefreshView("safe.transactions")
        })
      ],
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
