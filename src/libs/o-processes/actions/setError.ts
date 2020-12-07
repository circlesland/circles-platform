import { ProcessContext } from "../interfaces/processContext";
import { assign } from "xstate";

export const setError = assign((context: ProcessContext, event) => {
  context.result = {
    error: event
  };
  return context;
});
