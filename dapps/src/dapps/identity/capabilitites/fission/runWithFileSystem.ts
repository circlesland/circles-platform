import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {actions, createMachine} from "xstate";
import FileSystem from "omo-webnative/dist/fs";
import {ensureIsAuthenticated} from "../../utils/omo/fission/auth/ensureIsAuthenticated";
import {AuthSucceeded, Continuation, loadFileSystem} from "omo-webnative/dist";
const {escalate} = actions;

export interface RunWithFileSystemContext extends ProcessContext {
  func:(fileSystem:FileSystem) => Promise<any>
}

let _cachedFs:FileSystem|undefined = undefined;

const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<RunWithFileSystemContext, OmoEvent & { data?: any }>({
    id: "runWithFileSystem",
    initial: "init",
    states: {
      init: {
        initial: "ensureAuthentication",
        entry: () => console.log("runWithFileSystem: init"),
        states: {
          ensureAuthentication: {
            entry: () => console.log("runWithFileSystem: init.ensureAuthentication"),
            invoke: {
              src: ensureIsAuthenticated.stateMachine(progressView, successView, errorView),
              onError: "#error",
              onDone: "loadFileSystem"
            }
          },
          loadFileSystem: {
            entry: () => console.log("runWithFileSystem: init.loadFileSystem"),
            invoke: {
              src: async (context, event: OmoEvent&{data:AuthSucceeded|Continuation}) => {
                if (_cachedFs)
                {
                  // TODO: Check if the instance is still valid (if necessary)
                  return _cachedFs;
                }
                const fissionAuthState = event.data;
                _cachedFs = await loadFileSystem(fissionAuthState.permissions, fissionAuthState.username);
                return _cachedFs;
              },
              onDone: "#run",
              onError: "#error"
            }
          }
        }
      },
      run: {
        entry: () => console.log("runWithFileSystem: run"),
        id: "run",
        invoke: {
          src: async (context, event:OmoEvent&{data:FileSystem}) => {
            return await context.func(event.data);
          },
          onDone: "success",
          onError: "error"
        }
      },
      error: {
        id: "error",
        type: 'final',
        // TODO: Make 'escalate' work
        entry: escalate((context, event:OmoEvent&{data:Error}) => event.data),
        /*
        data: (context, event : OmoEvent & { data: Error }) => {
          console.log("runWithFileSystem.error", event.data);
          return event.data;
        }
         */
      },
      success: {
        type: 'final',
        data: (context, event : OmoEvent & { data: any }) => {
          console.log("runWithFileSystem.success. done data is: ", event.data);
          return event.data
        }
      }
    }
  });
}

/**
 * Run a function that requires the user's fission FileSystem as argument,
 */
export const runWithFileSystem: ProcessDefinition<(drive:FileSystem) => Promise<any>, any> = {
  name: "runWithFileSystem",
  stateMachine: <any>processDefinition
};