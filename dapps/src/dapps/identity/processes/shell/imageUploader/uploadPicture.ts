import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {createMachine, actions} from "xstate";
import {file} from "omo-process/dist/artifacts/file";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {uploadPublicFile} from "../../../capabilitites/fission/fs/uploadPublicFile";
import {ProcessContext} from "../../processContext";
import Banner from "../../../../../libs/o-views/atoms/Banner.svelte";
import {Bubble} from "../../../events/process/ipc/bubble";

const {assign, escalate, sendParent} = actions;

export class UploadPictureContext extends ProcessContext {
  targetDirectory: string;
  strings?: {
    promptTitle: string,
    promptButton: string;
    promptBanner?: string;
  }
  data: {
    picture: ProcessArtifact
  };
}

const processDefinition = (progressView: any, successView: any, errorView: any) => createMachine<UploadPictureContext, OmoEvent>({
  id: "uploadPicture",
  initial: "promptPicture",
  states: {
    promptPicture: {
      entry: [
        () => console.log("uploadPicture: promptPicture"),
        assign({
          data: (context) => context.data ?? {
            picture: {
              key: "picture",
              type: "file"
            }
          }
        }),
        sendParent((context) => {
          return <Bubble>{
            type: "process.ipc.bubble",
            tag: "testBubble",
            levels: 0,
            trace: [],
            wrappedEvent: {
              type: "process.prompt",
              title: context.strings?.promptTitle ?? "Please select a picture to upload",
              nextButtonTitle: context.strings?.promptButton ?? "Upload",
              canGoBack: true,
              hideNextButton: false,
              banner: context.strings?.promptBanner ? {
                component: Banner,
                data: {
                  text: context.strings.promptBanner
                }
              } : undefined,
              data: {
                ...file("picture", undefined, undefined, true)
              }
            }
          }
        })
      ],
      on: {
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "uploadPicture"
        }
      }
    },
    uploadPicture: {
      entry: () => console.log("uploadPicture: uploadPicture"),
      invoke: {
        src: uploadPublicFile.stateMachine(progressView, successView, errorView),
        data: {
          directory: (context) => context.targetDirectory,
          createDirectory: true,
          filename: undefined,
          bytes: (context) => context.data.picture.value,
          mimeType: "image/*" // TODO: Determine correct mime type
        },
        onError: "error",
        onDone: "success"
      }
    },
    error: {
      type: 'final',
      // TODO: Make 'escalate' work
      entry: escalate((context, event:OmoEvent&{data:Error}) => event.data),
      /*
      data: (context, event: OmoEvent & { data: Error }) => {
        throw event.data;
        console.log("uploadPicture.error", event.data);
        return event.data;
      }
      */
    },
    success: {
      type: 'final',
      data: (context, event: OmoEvent & {
        data: {
          path: string;
          directory: string;
          filename: string;
          size: number;
          cid: string;
          mimeType: string;
        }
      }) => {
        console.log("uploadPicture.success. done data is: ", event.data);
        return event.data
      }
    }
  }
});

export const uploadPicture: ProcessDefinition<{
  targetDirectory: string;
  strings?: {
    promptTitle: string,
    promptButton: string;
  }
}, {
  path: string;
  directory: string;
  filename: string;
  size: number;
  cid: string;
  mimeType: string;
}> = {
  name: "uploadPicture",
  stateMachine: <any>processDefinition
};