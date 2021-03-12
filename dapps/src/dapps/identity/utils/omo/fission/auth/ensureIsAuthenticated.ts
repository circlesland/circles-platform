import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {createMachine, actions} from "xstate";
const {send, escalate} = actions;
import {authorize} from "omo-central/dist/fission/auhtorize";
import {lobbyThemeCid} from "omo-central/dist/omoCentral";
import {ProcessContext} from "../../../../processes/processContext";
import {AuthSucceeded, Continuation, Scenario} from "omo-webnative/dist";

export interface EnsureIsAuthenticatedContext extends ProcessContext {
}

const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<EnsureIsAuthenticatedContext, OmoEvent>({
    initial: "authenticate",
    states: {
      authenticate: {
        entry: () => console.log("ensureIsAuthenticated: authenticate"),
        invoke: {
          src: async () => {
            return await authorize(lobbyThemeCid);
          },
          onError: "error",
          onDone: [{
            cond:(context, event) =>
              event.data.scenario
              && (event.data.scenario === Scenario.Continuation || event.data.scenario === Scenario.AuthSucceeded)
              && event.data.username
              && event.data.username.trim() !== "",
            target: "success"
          }, {
            actions: send((context, event) => {
              const msg = `'authorize()' didn't return Scenario.Continuation or Scenario.AuthSucceeded. Authentication failed.`;
              console.error(msg, event);

              return {
                type: "process.error",
                data: new Error(msg)
              }
            })
          }]
        },
        on: {
          "process.error": "error"
        }
      },
      error: {
        type: 'final',
        // TODO: Make 'escalate' work
        entry: escalate((context, event:OmoEvent&{data:Error}) => event.data)
        /*data: (context, event : OmoEvent & { data: Error }) => {
          console.log("ensureIsAuthenticated.error", event.data);
          return event.data;
        }*/
      },
      success: {
        type: 'final',
        data: (context, event : OmoEvent & { data: AuthSucceeded|Continuation }) => {
          console.log("ensureIsAuthenticated.success. done data is: ", event.data);
          return event.data
        }
      }
    }
  });
}

/**
 * Returns the user's current fission auth state or errors.
 */
export const ensureIsAuthenticated: ProcessDefinition<void,AuthSucceeded|Continuation> = {
  name: "ensureIsAuthenticated",
  stateMachine: <any>processDefinition
};