import {assign, createMachine} from "xstate";
import {strings} from "../../data/strings";
import JumpstartIntro from "../../views/molecules/JumpstartIntro.svelte";
import {OmoSafeState} from "../../manifest";
import {FissionAuthState} from "../../../fissionauth/manifest";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {config} from "omo-circles/dist/config";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {textLine} from "omo-process/dist/artifacts/textLine";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {tryGetDappState} from "omo-kernel/dist/kernel";

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
      entry: <any>[assign((context:FundAccountContext, event) =>
      {
        const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
        const fissionName = fissionAuthState.fission.username;
        const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
        const web3 = config.getCurrent().web3();
        const myAccount = web3.eth.accounts.privateKeyToAccount(safeState.myKey.privateKey).address;
        context.data.fundLink = {
          type: "string",
          key: "fundLink",
          value: window.location.origin + "#/safe/empowerMe/" + myAccount + "/" + fissionName
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
  stateMachine: <any>processDefinition
};

