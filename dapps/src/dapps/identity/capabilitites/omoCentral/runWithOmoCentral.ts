import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {actions, createMachine} from "xstate";
import {OmoCentral} from "omo-central/dist/omoCentral";
const {escalate} = actions;

export interface RunWithOmoCentralContext extends ProcessContext {
  func:(api:OmoCentral) => Promise<any>
}

const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<RunWithOmoCentralContext, OmoEvent & { data?: any }>({
    id: "runWithOmoCentral",
    initial: "run",
    states: {
      run: {
        entry: () => console.log("runWithOmoCentral: run"),
        invoke: {
          src: async (context) => {
            const omoCentral = await OmoCentral.instance.subscribeToResult();
            return await context.func(omoCentral);
          },
          onDone: "success",
          onError: "error"
        }
      },
      error: {
        type: 'final',
        // TODO: Make 'escalate' work
        entry: [
          () => console.log("runWithOmoCentral: error"),
          escalate((context, event:OmoEvent&{data:Error}) => event.data)
        ]/*,
        data: (context, event : OmoEvent & { data: Error }) => {
          console.log("runWithOmoCentral.error", event.data);
          return event.data;
        }
        */
      },
      success: {
        entry: () => console.log("runWithOmoCentral: success"),
        type: 'final',
        data: (context, event : OmoEvent & { data: any }) => {
          console.log("runWithOmoCentral.success. done data is: ", event.data);
          return event.data
        }
      }
    }
  });
}

/**
 * Run a function that requires the user's fission FileSystem as argument,
 */
export const runWithOmoCentral: ProcessDefinition<(omoCentral:OmoCentral) => Promise<any>, any> = {
  name: "runWithOmoCentral",
  stateMachine: <any>processDefinition
};