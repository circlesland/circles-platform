import {send} from "xstate";
import type {EventObject} from "xstate";
import {ProcessContext} from "../interfaces/processContext";
import {Prompt} from "../events/prompt";
import {ProcessArtifact} from "../interfaces/processArtifact";
import type {SendAction} from "xstate/lib/types";

export const sendPrompt = (config:{
  title?:string,
  data: { [key: string]: ProcessArtifact },
  bannerComponent?: any,
  nextButtonTitle?:string,
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
