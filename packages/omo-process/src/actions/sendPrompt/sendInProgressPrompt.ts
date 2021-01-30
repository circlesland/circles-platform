import { send } from "xstate";
import { ProcessContext } from "../../interfaces/processContext";
import { Prompt } from "../../events/prompt";
import {OmoEvent} from "omo-events/dist/omoEvent";

export function sendInProgressPrompt<TContext extends ProcessContext>(component:object, message?: (context: TContext) => string)
{
  return send<TContext, OmoEvent>((context: TContext) =>
  {
    return <Prompt>{
      hideNextButton: true,
      type: "process.prompt",
      banner: {
        //component: Progress,
        component: component,
        data: {
          text: message ? message(context) : undefined
        }
      },
      data: {}
    };
  });
}
