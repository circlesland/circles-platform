import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {createMachine, actions} from "xstate";
import {ShellProcessContext} from "./shellProcess";

export interface ShellProcessContextBuilderContext extends ProcessContext {
  shellProcessContext: ShellProcessContext;
}

const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<ShellProcessContextBuilderContext, OmoEvent & { data?: any }>({
    id: "shellProcessContextBuilder",
    initial: "start",
    states: {
      start: {
        always: [{
          cond: (context, event) => true,
          target: ""
        }, {
          cond: (context, event) => true,
          target: ""
        }]
      },
      ensureIsAuthenticated: {

      }
    }
  });
}
/**
 * Takes a ShellProcessContext and constructs the child process' context from it.
 */
export const shellProcessContextBuilder: ProcessDefinition<ShellProcessContext, ProcessContext> = {
  name: "shellProcessContextBuilder",
  stateMachine: <any>processDefinition
};