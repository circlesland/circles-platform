import {createMachine, send} from "xstate";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {strings} from "../../data/strings";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import JumpstartIntro from "../../views/molecules/JumpstartIntro.svelte";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {sendPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {ethereumAddress} from "../../../../libs/o-processes/artifacts/ethereumAddress";
import {RefreshView} from "../../../../libs/o-events/refreshView";
import {inviteCredits} from "../../../../libs/o-processes/artifacts/inviteCredits";
import {transferJumpstartXDaiService} from "./services/transferJumpstartXDaiService";

export interface JumpstartContext extends ProcessContext
{
  data: {
    recipient?: ProcessArtifact,
    value?: ProcessArtifact
  }
}


// TODO: Add checks to prevent from answering the same request twice
/**
 * Transfer jumpstart xDai
 */
const str = strings.safe.processes.jumpstart;
const processDefinition = () => createMachine<JumpstartContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on:{
        "process.continue": {
          target: "intro"
        }
      }
    },
    intro: {
      entry:sendPrompt((context:JumpstartContext) => {return{
        title: str.titleIntro(),
        nextButtonTitle: "Empower " + context.data.recipient.value.substring(0,8),
        banner: {
          component: JumpstartIntro,
          data: {
            header: str.introHeader(context),
            subHeader: str.introSubHeader(context),
            body: str.introBody(context)
          }
        },
        artifacts: {}
      }}),
      on: {
        "process.cancel": "stop",
        "process.continue": "summarize"
      }
    },
    summarize: {
      entry: sendPrompt((context:JumpstartContext) => {return{
        title: str.titleSummary(),
        nextButtonTitle: "Use 1 invite credit",
        canGoBack: true,
        banner: {
          component: Banner,
          data: {
            text: str.bannerSummary()
          }
        },
        artifacts: {
          ...ethereumAddress("recipient", str.titleRecipient(), true),
          ...inviteCredits("value", str.titleValue())
        }
      }}),
      on: {
        "process.back": "intro",
        "process.cancel": "stop",
        "process.continue": "transferJumpstartXDai"
      }
    },
    transferJumpstartXDai: {
      entry: sendInProgressPrompt(str.titleProgress),
      invoke: {
        id: 'transferJumpstartXDai',
        src: transferJumpstartXDaiService,
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
          payload: new RefreshView("safe.tokens")
        })
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

export const jumpstart: ProcessDefinition = {
  name: "jumpstart",
  stateMachine: processDefinition
};
