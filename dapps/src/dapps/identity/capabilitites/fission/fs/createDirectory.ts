import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {actions, createMachine} from "xstate";
import {runWithFileSystem} from "../runWithFileSystem";
import FileSystem from "omo-webnative/dist/fs";
const {escalate} = actions;

export interface CreateDirectoryContext extends ProcessContext {
  path:string
}

const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<CreateDirectoryContext, OmoEvent & { data?: any }>({
    id: "createDirectory",
    initial: "createDirectory",
    states: {
      createDirectory: {
        entry: () => console.log("createDirectory: createDirectory"),
        invoke: {
          src: runWithFileSystem.stateMachine(progressView, successView, errorView),
          data: {
            func: (context: CreateDirectoryContext) => {
              return async (fileSystem: FileSystem) => {
                await fileSystem.mkdir(context.path);
              };
            }
          },
          onDone: "success",
          onError: "error"
        }
      },
      error: {
        type: 'final',
        entry: [
          () => console.log("createDirectory: error"),
          escalate((context, event:OmoEvent&{data:Error}) => event.data)
        ]
      },
      success: {
        entry: () => console.log("createDirectory: success"),
        type: 'final',
        data:  (context, event : OmoEvent) => {
          console.log("createDirectory.success.");
          return undefined;
        }
      }
    }
  });
}

  /**
   * Creates a new directory at the specified position in the user's fission drive.
   */
export const createDirectory: ProcessDefinition<{
  path:string
}, void> = {
  name: "createDirectory",
  stateMachine: <any>processDefinition
};