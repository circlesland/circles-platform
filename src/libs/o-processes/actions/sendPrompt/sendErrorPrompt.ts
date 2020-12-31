import { send } from "xstate";
import Error from "../../../o-views/atoms/Error.svelte";
import { ProcessContext } from "../../interfaces/processContext";
import { Prompt } from "../../events/prompt";

export const sendErrorPrompt = send((context: ProcessContext) => {
  return <Prompt>{
    nextButtonTitle: "Close",
    type: "process.prompt",
    banner: {
      component: Error,
      data: {
        error: context.result.error
      }
    },
    data: {
    }
  }
});
