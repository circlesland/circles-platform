import {send} from "xstate";
import Success from "../../../o-views/atoms/Success.svelte";
import {ProcessContext} from "../../interfaces/processContext";
import {Prompt} from "../../events/prompt";

export const sendSuccessPrompt = send((context:ProcessContext) => {
  return <Prompt>{
    nextButtonTitle: "Close",
    type: "process.prompt",
    banner: Success,
    hideNextButton: true,
    data: {
      success: {
        key: "success",
        isReadonly: true,
        isHidden: true,
        type: "string",
        value: context.result.success
      }
    }
  }
});
