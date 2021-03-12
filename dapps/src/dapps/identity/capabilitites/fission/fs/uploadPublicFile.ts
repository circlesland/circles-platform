import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {actions, createMachine} from "xstate";
import {runWithFileSystem} from "../runWithFileSystem";
import FileSystem from "omo-webnative/dist/fs";
import {createDirectory} from "./createDirectory";
import {Generate} from "omo-utils/dist/generate";
import {ipfs} from "omo-webnative/dist";

const {assign, send, escalate} = actions;

export interface UploadPublicFileContext extends ProcessContext {
  directory: string;
  createDirectory?: boolean;
  filename?: string;
  bytes: Buffer;
  targetPath?: string;
}

const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<UploadPublicFileContext, OmoEvent & { data?: any }>({
    id: "uploadPublicFile",
    initial: "checkArguments",
    states: {
      checkArguments: {
        entry: () => console.log("uploadPublicFile: checkArguments"),
        always: [{
          cond: (context) => !context.directory?.startsWith("public"),
          actions: send((context) => {
            return {
              type: "process.error",
              data: new Error(`The directory path (${context.directory}) must begin with 'public'.`)
            }
          })
        }, {
          target: "generateFilenameIfNecessary"
        }],
        on: {
          "process.error": "error"
        }
      },
      generateFilenameIfNecessary: {
        entry: () => console.log("uploadPublicFile: generateFilenameIfNecessary"),
        always: {
          actions: assign({
            filename: (context) => !context.filename || context.filename.trim() === ""
              ? Generate.randomHexString()
              : context.filename.trim()
          }),
          target: "generateTargetPath"
        }
      },
      generateTargetPath: {
        entry: () => console.log("uploadPublicFile: generateTargetPath"),
        always: {
          actions: assign({
            targetPath: (context) =>
              context.directory
              + (!context.directory.endsWith("/") ? "/" : "")
              + context.filename
          }),
          target: "ensureTargetDirectoryExists"
        }
      },
      ensureTargetDirectoryExists: {
        entry: () => console.log("uploadPublicFile: ensureTargetDirectoryExists"),
        initial: "exists",
        states: {
          exists: {
            entry: () => console.log("uploadPublicFile: ensureTargetDirectoryExists.exists"),
            invoke: {
              src: runWithFileSystem.stateMachine(progressView, successView, errorView),
              data: {
                func: (context: UploadPublicFileContext) => {
                  return async (fileSystem: FileSystem) => await fileSystem.exists(context.targetPath);
                }
              },
              onError: "#error",
              onDone: [{
                  cond: (context, event) => event.data,
                  target: "#upload"
                }, {
                  cond: (context, event) => context.createDirectory && !event.data,
                  target: "create"
                }, {
                  cond: (context, event) => !context.createDirectory && !event.data,
                  actions: (context) => send({
                    type: "process.error",
                    data: new Error(`The target directory (${context.directory}) doesn't exist and 'createDirectory' is set to 'false'`)
                  })
                }
              ]
            },
            on: {
              "process.error": "#error"
            }
          },
          create: {
            entry: () => console.log("uploadPublicFile: ensureTargetDirectoryExists.create"),
            invoke: {
              src: createDirectory.stateMachine(progressView, successView, errorView),
              data: {
                path: (context) => context.directory
              },
              onDone: "#upload",
              onError: "#error"
            }
          }
        }
      },
      upload: {
        id: "upload",
        entry: () => console.log("uploadPublicFile: upload"),
        invoke: {
          src: runWithFileSystem.stateMachine(progressView, successView, errorView),
          data: {
            func: (context: UploadPublicFileContext) => {
              return async (fileSystem: FileSystem) => {
                console.log("uploadPublicFile: upload - context: ", context);
                await fileSystem.add(context.targetPath, context.bytes, {publish: false});
              }
            }
          },
          onDone: "retrieveCid",
          onError: "error"
        }
      },
      retrieveCid: {
        entry: () => console.log("uploadPublicFile: retrieveCid"),
        invoke: {
          src: runWithFileSystem.stateMachine(progressView, successView, errorView),
          data: {
            func: (context: UploadPublicFileContext) => {
              return async (fileSystem: FileSystem) => {
                const rootCid = await fileSystem.publish();
                const ipfs_ = await ipfs.get();
                const file = await ipfs_.files.stat(`/ipfs/${rootCid}/p/${context.targetPath.replace("public/", "")}`);
                const cid = (<any>file).cid.toString();

                return {
                  path: context.targetPath,
                  directory: context.directory,
                  filename: context.filename,
                  size: context.bytes.length,
                  cid: cid
                }
              };
            }
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
        data: (context, event: OmoEvent & { data: Error }) => {
          console.log("uploadPublicFile.error", event.data);
          return event.data;
        }
         */
      },
      success: {
        type: 'final',
        data: (context, event: OmoEvent & { data: any }) => {
          console.log("uploadPublicFile.success. done data is: ", event.data);
          return event.data
        }
      }
    }
  });
}

/**
 * Uploads a file to a public location in the user's fission drive and returns the cid.
 * The filename is optional. If no filename is given, one will be generated.
 * If 'createDirectory' is 'true', the target path will be created if it doesn't exist.
 * Else the process fails when the target doesn't exist.
 */
export const uploadPublicFile: ProcessDefinition<{
  directory: string;
  createDirectory?: boolean;
  filename?: string;
  bytes: Buffer;
}, {
  path: string;
  directory: string;
  filename: string;
  size: number;
  cid: string;
}> = {
  name: "uploadPublicFile",
  stateMachine: <any>processDefinition
};