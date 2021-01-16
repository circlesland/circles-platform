import { send } from "xstate";
//import Progress from "../../../o-views/atoms/Progress.svelte";
import { ProcessContext } from "../../interfaces/processContext";
import { Prompt } from "../../events/prompt";

export const sendInProgressPrompt = (component:unknown, message?: (context: ProcessContext) => string) =>
  send((context: ProcessContext) => {
    return <Prompt>{
      hideNextButton: true,
      type: "process.prompt",
      banner: {
        //component: Progress,
        component: component,
        data: {
          text: message ? message(context) : undefined
        }
      },
      data: {}
    };
  });
