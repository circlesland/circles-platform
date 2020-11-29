import {send} from "xstate";
import Error from "../../../o-views/atoms/Error.svelte";
import {ProcessContext} from "../../interfaces/processContext";
import {Prompt} from "../../events/prompt";

export const sendErrorPrompt = send((context:ProcessContext) => {
  return <Prompt>{
    nextButtonTitle: "Close",
    type: "process.prompt",
    banner: Error,
    data: {
      error: {
        key: "error",
        isReadonly: true,
        isHidden: true,
        type: "string",
        value: context.result.error
      }
    }
  }
});
