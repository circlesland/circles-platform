import {send} from "xstate";
import Progress from "../../../o-views/atoms/Progress.svelte";
import {ProcessContext} from "../../interfaces/processContext";
import {Prompt} from "../../events/prompt";

export const sendInProgressPrompt = (message?:(context:ProcessContext) => string) =>
  send((context:ProcessContext) => {
    return <Prompt>{
      hideNextButton: true,
      type: "process.prompt",
      banner: Progress,
      data: {
        progress: {
          key: "progress",
          isReadonly: true,
          isHidden: true,
          type: "string",
          value: message ? message(context) : undefined
        }
      }
    };
  });
