import {assign, createMachine} from "xstate";
import {strings} from "../../data/strings";
import {BN} from "ethereumjs-util";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {tryGetDappState} from "../../../../libs/o-os/loader";
import {OmoSafeState} from "../../manifest";
import {deploySafeService} from "../../services/deploySafeService";
import {GnosisSafeProxyFactory} from "omo-circles/dist/safe/gnosisSafeProxyFactory";
import Web3 from "web3";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt, sendShellEvent} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {NavigateTo} from "omo-events/dist/shell/navigateTo";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface DeploySafeContext extends ProcessContext {
  web3:Web3;
  safeProxyFactory:GnosisSafeProxyFactory;
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
            return safeState.myAccountXDaiBalance?.gte(new BN(context.web3.utils.toWei("0.0097", "ether"))) === true;
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

