import { ProcessContext } from "../interfaces/processContext";
import { assign } from "xstate";

export const setError = assign((context: ProcessContext, event) => {
  console.warn("A process encountered an error:", event);
  context.result = {
    error: (<any>event).data
  };
  return context;
});
