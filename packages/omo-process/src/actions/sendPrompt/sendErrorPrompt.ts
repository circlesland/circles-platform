import { send } from "xstate";
// import Error from "../../../o-views/atoms/Error.svelte";
import { ProcessContext } from "../../interfaces/processContext";
import { Prompt } from "../../events/prompt";

export const sendErrorPrompt = (component:unknown) => send((context: ProcessContext) => {
  return <Prompt>{
    nextButtonTitle: "Close",
    type: "process.prompt",
    banner: {
      // component: Error,
      component: component,
      data: {
        error: context.result?.error
      }
    },
    data: {
    }
  }
});
