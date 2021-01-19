import {assign, createMachine, send} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import JumpstartIntro from "../../views/molecules/JumpstartIntro.svelte";
import {strings} from "../../data/strings";
import {transferJumpstartXDaiService} from "../../services/transferJumpstartXDaiService";
import {getForeignProfileService} from "../../services/getForeignProfile";
import Web3 from "omo-quirks/dist/web3";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {Profile} from "omo-models/dist/omo/profile";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {ethereumAddress} from "omo-process/dist/artifacts/ethereumAddress";
import {inviteCredits} from "omo-process/dist/artifacts/inviteCredits";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface JumpstartContext extends ProcessContext {
  web3:Web3;
  data: {
    foreignProfileFissionName?: ProcessArtifact,
    foreignProfile?: ProcessArtifact,
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
      on: {
        "process.continue": {
          target: "getForeignProfile"
        }
      }
    },
    getForeignProfile: {
      entry: <any>sendInProgressPrompt(str.loadingForeignProfile),
      invoke: <any>{
        id: 'getForeignProfile',
        src: getForeignProfileService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: assign((context:JumpstartContext, event:any) => {
            context.data.foreignProfile  = {
                key: "foreignProfile",
                type: "omo.sapien:1:profile",
                value: <Profile>event.data
            };
            return context;
          }),
          target: "intro"
        }
      }
    },
    intro: {
      entry: <any>sendPrompt((context: JumpstartContext) => {
        return {
          title: str.titleIntro(),
          nextButtonTitle: `Empower ${context.data.foreignProfile.value.profile.firstName} ${context.data.foreignProfile.value.profile.lastName}`,
          banner: {
            component: JumpstartIntro,
            data: {
              header: str.introHeader(context),
              subHeader: str.introSubHeader(),
              body: str.introBody(context)
            }
          },
          artifacts: {}
        }
      }),
      on: {
        "process.cancel": "stop",
        "process.continue": "summarize"
      }
    },
    summarize: {
      entry: <any>sendPrompt((context: JumpstartContext) => {
        return {
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
        }
      }),
      on: {
        "process.back": "intro",
        "process.cancel": "stop",
        "process.continue": "transferJumpstartXDai"
      }
    },
    transferJumpstartXDai: {
      entry: <any>sendInProgressPrompt(str.titleProgress),
      invoke: <any>{
        id: 'transferJumpstartXDai',
        src: transferJumpstartXDaiService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successMessage),
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
  stateMachine: <any>processDefinition
};
