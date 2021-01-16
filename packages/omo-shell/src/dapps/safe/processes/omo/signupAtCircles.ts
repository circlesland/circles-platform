import {strings} from "../../data/strings";
import {createMachine} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {hubSignupService} from "../../services/hubSignupService";
import Web3 from "omo-quirks/dist/web3";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt, sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {NavigateTo} from "omo-events/dist/shell/navigateTo";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";

export interface SignupAtCirclesContext extends ProcessContext {
  web3:Web3;
  circlesHub:CirclesHub;
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
      entry: <any>sendPrompt((context) => {
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
          target: "hubSignup"
        }]
      }
    },
    hubSignup: {
      entry: <any>sendInProgressPrompt(str.progressHubSignup),
      invoke: <any>{
        id: 'hubSignup',
        src: hubSignupService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successHubSignup),
          target: "success"
        }
      }
    },
    success: {
      entry:<any> [
        sendSuccessPrompt,
        sendShellEvent(new NavigateTo("/safe/tokens"))
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
  stateMachine:<any> processDefinition
};
