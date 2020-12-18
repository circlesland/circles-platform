import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {strings} from "../../data/strings";
import {createMachine} from "xstate";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {ConnectSafeContext} from "./importCircles";
import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";

export interface SignupAtCirclesContext extends ProcessContext {
  data: {
    privateKey?: ProcessArtifact
    privateKeyPhrase?: ProcessArtifact
    safeAddress?: ProcessArtifact,
    fundLink?: ProcessArtifact,
    safeChoice?: ProcessArtifact,
    tokenAddress?: ProcessArtifact
  }
}

const str = strings.safe.processes.signupAtCircles;
const processDefinition = () => createMachine<ConnectSafeContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "promptSafeAddress"
      }
    },
  }
});

export const signupAtCircles: ProcessDefinition = {
  name: "signupAtCircles",
  stateMachine: processDefinition
};
