import {ProcessContext} from "../interfaces/processContext";
import {assign} from "xstate";

export const setResult = assign((context: ProcessContext, event) =>
{
  context.result = {
    success: event
  };
  return context;
});
