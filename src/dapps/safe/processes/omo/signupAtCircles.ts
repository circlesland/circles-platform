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
  states: {}
});

export const signupAtCircles: ProcessDefinition = {
  name: "signupAtCircles",
  stateMachine: processDefinition
};
