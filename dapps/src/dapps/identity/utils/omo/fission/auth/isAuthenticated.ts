import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {createMachine} from "xstate";
import {actions} from "xstate/";
const {escalate} = actions;
import {buildUcan} from "omo-webnative/dist";
import {decodeUcan} from "omo-ucan/dist/decodeUcan";


export interface IsAuthenticatedContext extends ProcessContext {
}

const processDefinition = (progressView: any, successView: any, errorView: any) =>
  createMachine<IsAuthenticatedContext, OmoEvent>({
    initial: "buildUcan",
    states: {
      buildUcan: {
        invoke: {
          // Try to create a ucan for myself
          src: async (context) => {
            return await buildUcan("123") // TODO: rewrite the auth check
          },
          onError: "error",
          onDone: "validateUcan"
        }
      },
      validateUcan: {
        // Check if the ucan is valid
        invoke: {
          src: async (context, event: OmoEvent & { data: string }) => {
            // TODO: Hack! We just assume that the user is authenticated when he can create a valid ucan
            //return verifyUcan(event.data, context.myDid).isValid
            const decodedUcan = decodeUcan(event.data);
            const fissionName = (<any>decodedUcan.payload.rsc)?.username;
            return fissionName && fissionName.trim() !== "";
          },
          onError: "error",
          onDone: "finished"
        }
      },
      error: {
        type: 'final',
        entry: (context, event: OmoEvent & { data: Error }) => escalate(event.data),
        data: (context, event : OmoEvent & { data: Error }) => {
          console.log("isAuthenticated.error: ", event.data);
          return event.data;
        }
      },
      finished: {
        type: 'final',
        // use the result of 'validateUcan' as machine result
        data: (context, event : OmoEvent & { data: boolean }) => {
          console.log("isAuthenticated.finished. done data is: ", event.data);
          return event.data
        }
      }
    }
  });

export const isAuthenticated: ProcessDefinition<void, boolean> = {
  name: "isAuthenticated",
  stateMachine: <any>processDefinition
};
