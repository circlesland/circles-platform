import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {assign, createMachine} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {strings} from "../../data/strings";
import {BN} from "ethereumjs-util";
import {sendPrompt, sendShellEvent} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {tryGetDappState} from "../../../../libs/o-os/loader";
import {OmoSafeState} from "../../manifest";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setProcessResult} from "../../../../libs/o-processes/actions/setProcessResult";
import {deploySafeService} from "../../services/deploySafeService";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {NavigateTo} from "../../../../libs/o-events/navigateTo";

export interface DeploySafeContext extends ProcessContext {
  data: {
    safeAddress?: ProcessArtifact,
  }
}

const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine<DeploySafeContext, OmoEvent>({
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
          title: "Create a new safe?",
          nextButtonTitle: "Next",
          banner: {
            component: Banner,
            data: {
              text: "Clicking 'Next' will create a new safe"
            }
          },
          artifacts: {}
        }
      }),
      on: {
        "process.continue": [{
          cond: (context) => {
            const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
            return safeState.myAccountXDaiBalance?.gte(new BN(context.environment.eth.web3.utils.toWei("0.0097", "ether"))) === true;
          },
          target: "deploySafe"
        }, {
          actions: [
            assign((context: ProcessContext, event) => {
              context.result = {
                error: new Error("You have not enough xDai on your account to deploy a new safe.")
              }
              return context;
            })
          ],
          target: "error"
        }]
      }
    },
    deploySafe: {
      entry: sendInProgressPrompt(str.progressCreatePrivateKey),
      invoke: {
        id: 'deploySafe',
        src: deploySafeService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successDeploySafe),
          target: "success"
        }
      }
    },
    success: {
      entry: [
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

export const deploySafe: ProcessDefinition = {
  name: "deploySafe",
  stateMachine: processDefinition
};

