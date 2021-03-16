import {createMachine, actions} from "xstate";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {runWithOmoCentral} from "../../capabilitites/omoCentral/runWithOmoCentral";
import {OmoCentral} from "omo-central/dist/omoCentral";
import {Message} from "omo-central/dist/generated";
const {escalate} = actions;

export interface SendMessageContext extends ProcessContext {
  topic: string;
  recipientFissionName:string;
  body:any;
}

const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<SendMessageContext, OmoEvent>({
  initial: "sendMessage",
  states: {
    sendMessage: {
      invoke: <any>{
        id: 'sendMessage',
        src: runWithOmoCentral.stateMachine(progressView, successView, errorView),
        data: {
          func: (context: SendMessageContext) => {
            return async (omoCentral: OmoCentral) => {
              const sentMessage = await omoCentral.sendMessage({
                type: "text/plain",
                topic: context.topic,
                toFissionName: context.recipientFissionName,
                content: JSON.stringify(context.body)
              });
              return sentMessage.data.sendMessage;
            }
          }
        },
        onError: {
          target: "error"
        },
        onDone: {
          target: "success"
        }
      }
    },
    error: {
      type: 'final',
      entry: escalate((context, event:OmoEvent&{data:Error}) => event.data)
    },
    success: {
      type: 'final',
      data: (context, event : OmoEvent & { data: boolean }) => {
        console.log("sendMessage.success", event.data);
        return event.data
      }
    }
  }
});

export const sendMessage: ProcessDefinition<{
  topic: string;
  recipientFissionName:string;
  body:any;
},Message> = {
  name: "sendMessage",
  stateMachine:<any> processDefinition
};
