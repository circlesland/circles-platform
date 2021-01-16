import { send } from "xstate";
// import Success from "../../../o-views/atoms/Success.svelte";
import { ProcessContext } from "../../interfaces/processContext";
import { Prompt } from "../../events/prompt";

export const sendSuccessPrompt = (component:unknown) =>  send((context: ProcessContext) => {
  return <Prompt>{
    nextButtonTitle: "Close",
    type: "process.prompt",
    banner: {
      // component: Success,
      component: component,
      data: {
        text: context.result?.success
      }
    },
    hideNextButton: true,
    data: {}
  }
});
