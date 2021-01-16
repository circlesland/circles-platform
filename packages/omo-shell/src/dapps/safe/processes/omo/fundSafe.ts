import {strings} from "../../data/strings";
import {createMachine} from "xstate";
import {fundSafeService} from "../../services/fundSafeService";
import Web3 from "web3"
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {NavigateTo} from "omo-events/dist/shell/navigateTo";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface FundSafeContext extends ProcessContext
{
  web3:Web3;
}

const str = strings.safe.processes.jumpstart;
const processDefinition = () => createMachine<FundSafeContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": {
          target: "fundSafe"
        }
      }
    },
    fundSafe: {
      entry: <any>sendInProgressPrompt(str.titleProgress),
      invoke: <any>{
        id: 'fundSafe',
        src: fundSafeService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(() => "Your safe isnow funded."),
          target: "success"
        }
      }
    },
    success: {
      entry:<any> [
        sendSuccessPrompt,
        sendShellEvent(new NavigateTo("/safe/transactions"))
      ],
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

export const fundSafe: ProcessDefinition = {
  name: "fundSafe",
  stateMachine: <any>processDefinition
};
