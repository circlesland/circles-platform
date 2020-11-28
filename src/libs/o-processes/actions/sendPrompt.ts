import {send} from "xstate";
import type {EventObject} from "xstate";
import {ProcessContext} from "../interfaces/processContext";
import {Prompt} from "../events/prompt";
import {ProcessArtifact} from "../interfaces/processArtifact";
import type {SendAction} from "xstate/lib/types";
import Error from "../../o-views/atoms/Error.svelte"
import Success from "../../o-views/atoms/Success.svelte"
import Progress from "../../o-views/atoms/Progress.svelte"

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

export const sendInProgress = (message?:(context:ProcessContext) => string) =>
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

export const sendPrompt = (config:{
  title?:string,
  data: { [key: string]: ProcessArtifact },
  bannerComponent?: any,
  nextButtonTitle?:string
}) =>
{
  const action: SendAction<ProcessContext, EventObject, Prompt> = send((context) => {
    Object.keys(config.data)
      .filter(key => context.data[key] !== undefined)
      .forEach(key => config.data[key].value = context.data[key].value);

    return <Prompt>{
      title: config.title ? config.title : "",
      nextButtonTitle: config.nextButtonTitle,
      type: "process.prompt",
      banner: config.bannerComponent,
      data: config.data
    }
  });

  return action;
}
