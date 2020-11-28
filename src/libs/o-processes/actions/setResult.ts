import {ProcessContext} from "../interfaces/processContext";
import {assign, AssignAction, EventObject} from "xstate";

export const setResult = (message?:(context:ProcessContext) => string) =>
{
  const action: AssignAction<ProcessContext, EventObject> = assign((context: ProcessContext, event) =>
  {
    context.result = {
      success: message ?  message(context) : event
    };
    return context;
  });

  return action;
};
