import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {assign, createMachine} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {sendPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import {strings} from "../../data/strings";
import {textLine} from "../../../../libs/o-processes/artifacts/textLine";
import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";
import JumpstartIntro from "../../views/molecules/JumpstartIntro.svelte";
import {tryGetDappState} from "../../../../libs/o-os/loader";
import {config} from "../../../../libs/o-circles-protocol/config";
import {OmoSafeState} from "../../manifest";

export interface FundAccountContext extends ProcessContext {
  data: {
    fundLink?: ProcessArtifact,
  }
}

const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine<FundAccountContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "generateFundLink"
      }
    },
    generateFundLink: {
      entry: [assign((context, event) =>
      {
        const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
        const web3 = config.getCurrent().web3();
        const myAccount = web3.eth.accounts.privateKeyToAccount(safeState.myKey.privateKey).address;
        context.data.fundLink = {
          type: "string",
          key: "fundLink",
          value: window.location.origin + "#/safe/empowerMe/" + myAccount
        }
        return context;
      }),
      sendPrompt((context: FundAccountContext) => {
        return {
          title: str.titleGenerateFundLink(),
          nextButtonTitle: str.buttonGenerateFundLink(),
          hideNextButton: true,
          banner: {
            component: JumpstartIntro,
            data: {
              header: str.fundLinkHeader(),
              subHeader: str.fundLinkSubHeader(),
              body: str.fundLinkBody()
            }
          },
          artifacts: {
            ...textLine("fundLink", undefined, true)
          }
        }
      })],
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

export const fundAccountForSafeCreation: ProcessDefinition = {
  name: "fundAccountForSafeCreation",
  stateMachine: processDefinition
};

