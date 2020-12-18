import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {createMachine, send} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {strings} from "../../data/strings";
import {BN} from "ethereumjs-util";
import {sendPrompt, sendShellEvent} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import {CloseModal} from "../../../../libs/o-events/closeModal";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {textLine} from "../../../../libs/o-processes/artifacts/textLine";
import {tryGetDappState} from "../../../../libs/o-os/loader";
import {OmoSafeState} from "../../manifest";

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
            return safeState.myAccountXDaiBalance?.gte(new BN(context.environment.eth.web3.utils.toWei("0.02", "ether"))) === true;
          },
          target: "success"
        }, {
          target: "generateFundLink"
        }]
      }
    },
    success: {
      entry: [
        sendShellEvent(new CloseModal())
      ],
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

