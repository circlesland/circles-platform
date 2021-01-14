import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {strings} from "../../data/strings";
import {assign, createMachine} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {getForeignProfileService} from "../../services/getForeignProfile";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {Profile} from "../../../../libs/o-fission/entities/profile";
import {sendPrompt, sendShellEvent} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import JumpstartIntro from "../../views/molecules/JumpstartIntro.svelte";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {ethereumAddress} from "../../../../libs/o-processes/artifacts/ethereumAddress";
import {inviteCredits} from "../../../../libs/o-processes/artifacts/inviteCredits";
import {transferJumpstartXDaiService} from "../../services/transferJumpstartXDaiService";
import {setProcessResult} from "../../../../libs/o-processes/actions/setProcessResult";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {JumpstartContext} from "./jumpstart";
import {fundSafeService} from "../../services/fundSafeService";
import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import {NavigateTo} from "../../../../libs/o-events/navigateTo";

export interface FundSafeContext extends ProcessContext
{
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
      entry: sendInProgressPrompt(str.titleProgress),
      invoke: {
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
      entry: [
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
  stateMachine: processDefinition
};
