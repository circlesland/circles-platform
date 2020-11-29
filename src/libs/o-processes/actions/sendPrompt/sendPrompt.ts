import {send} from "xstate";
import type {EventObject} from "xstate";
import type {SendAction} from "xstate/lib/types";
import {ProcessArtifact} from "../../interfaces/processArtifact";
import {ProcessContext} from "../../interfaces/processContext";
import {Prompt} from "../../events/prompt";

export type PromptSpec = {
  title?:string,
  artifacts: { [key: string]: ProcessArtifact },
  banner?: {
    component:any,
    data:any
  },
  nextButtonTitle?:string,
  hideNextButton?:boolean,
  canGoBack?:boolean
};

export const sendPrompt = (spec:PromptSpec) =>
{
  const action: SendAction<ProcessContext, EventObject, Prompt> = send((context) => {
    Object.keys(spec.artifacts)
      .filter(key => context.data[key] !== undefined)
      .forEach(key => spec.artifacts[key].value = context.data[key].value);

    return <Prompt>{
      title: spec.title ? spec.title : "",
      nextButtonTitle: spec.nextButtonTitle,
      hideNextButton: spec.hideNextButton,
      canGoBack: spec.canGoBack,
      type: "process.prompt",
      banner: spec.banner,
      data: spec.artifacts
    }
  });

  return action;
}
