import {send} from "xstate";
import type {EventObject} from "xstate";
import type {SendAction} from "xstate/lib/types";
import {ProcessArtifact} from "../../interfaces/processArtifact";
import {ProcessContext} from "../../interfaces/processContext";
import {Prompt} from "../../events/prompt";

export type PromptSpec = {
  title?:string,
  data: { [key: string]: ProcessArtifact },
  banner?: any,
  nextButtonTitle?:string
  canGoBack?:boolean
};

export const sendPrompt = (spec:PromptSpec) =>
{
  const action: SendAction<ProcessContext, EventObject, Prompt> = send((context) => {
    Object.keys(spec.data)
      .filter(key => context.data[key] !== undefined)
      .forEach(key => spec.data[key].value = context.data[key].value);

    return <Prompt>{
      title: spec.title ? spec.title : "",
      nextButtonTitle: spec.nextButtonTitle,
      canGoBack: spec.canGoBack,
      type: "process.prompt",
      banner: spec.banner,
      data: spec.data
    }
  });

  return action;
}
