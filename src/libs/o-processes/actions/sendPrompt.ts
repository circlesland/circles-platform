import {send} from "xstate";
import type {EventObject} from "xstate";
import {ProcessContext} from "../interfaces/processContext";
import {Prompt} from "../events/prompt";
import {ProcessArtifact} from "../interfaces/processArtifact";
import type {SendAction} from "xstate/lib/types";

export const sendPrompt = (title:string, data: { [key: string]: ProcessArtifact }, bannerComponent?: any) =>
{
  const action: SendAction<ProcessContext, EventObject, Prompt> = send((context) => {

    Object.keys(data)
      .filter(key => context.data[key] !== undefined)
      .forEach(key => data[key].value = context.data[key].value);

    return <Prompt>{
      title,
      type: "process.prompt",
      banner: bannerComponent,
      data: data
    }
  });

  return action;
}
