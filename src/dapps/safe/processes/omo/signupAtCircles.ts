import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {strings} from "../../data/strings";
import {createMachine} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ConnectSafeContext} from "./importCircles";
import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {createPrivateKeyService} from "../../services/createPrivateKeyService";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {sendPrompt, sendShellEvent} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {text} from "../../../../libs/o-processes/artifacts/text";
import {RunProcess} from "../../../../libs/o-events/runProcess";
import {fundAccountForSafeCreation} from "./fundAccountForSafeCreation";
import {hubSignupService} from "../../services/hubSignupService";
import {tryGetDappState} from "../../../../libs/o-os/loader";
import {OmoSafeState} from "../../manifest";
import {BN} from "ethereumjs-util";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {fundSafeService} from "../../services/fundSafeService";

export interface SignupAtCirclesContext extends ProcessContext {
  data: {
  }
}

const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine<SignupAtCirclesContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "introduction"
      }
    },
    introduction: {
      entry: sendPrompt((context) => {
        return {
          title: "Create a Circles account?",
          nextButtonTitle: "Next",
          banner: {
            component: Banner,
            data: {
              text: `Clicking 'Next' will sign you up for Circles.
A small amount of the credits you received from your invite will be used to do that.`
            }
          },
          artifacts: {}
        }
      }),
      on: {
        "process.continue": [{
          target: "fundSafe"
        }]
      }
    },
    fundSafe: {
      entry: sendInProgressPrompt(str.progressFundSafe),
      invoke: {
        id: 'fundSafe',
        src: fundSafeService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setResult(str.successFundSafe),
          target: "hubSignup"
        }
      }
    },
    hubSignup: {
      entry: sendInProgressPrompt(str.progressHubSignup),
      invoke: {
        id: 'hubSignup',
        src: hubSignupService,
        onError: {
          actions: "setError",
          target: "error"
        },
        onDone: {
          actions: setResult(str.successHubSignup),
          target: "success"
        }
      }
    },
    success: {
      entry: [
        sendSuccessPrompt
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

export const signupAtCircles: ProcessDefinition = {
  name: "signupAtCircles",
  stateMachine: processDefinition
};
