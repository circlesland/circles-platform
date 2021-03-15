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
import {Prompt} from "omo-process/dist/events/prompt";
import {Continue} from "omo-process/dist/events/continue";
import {ipc} from "../../../patterns/ipc";

const {assign, escalate, sendParent} = actions;

export class UploadPictureContext extends ProcessContext {
  targetDirectory: string;
  isOptional?: boolean;
  canGoBack?: boolean;
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
                levels: 0,
            trace: [],
            wrappedEvent: <Prompt>{
              type: "process.prompt",
              title: context.strings?.promptTitle ?? "Please select a picture to upload",
              nextButtonTitle: context.strings?.promptButton ?? "Upload",
              canGoBack: context.canGoBack,
              hideNextButton: false,
              banner: context.strings?.promptBanner ? {
                component: Banner,
                data: {
                  text: context.strings.promptBanner
                }
              } : undefined,
              data: {
                ...file("picture", undefined, undefined, context.isOptional)
              }
            }
          }
        })
      ],
      on: {
        ...ipc("promptPicture"),
        "process.continue": [{
          cond: (context, event:Continue) => !!event.data,
          actions: <any>storePromptResponse,
          target: "uploadPicture"
        }, {
          target: "success"
        }]
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
      entry: escalate((context, event:OmoEvent&{data:Error}) => event.data)
    },
    success: {
      type: 'final',
      data: (context, event: OmoEvent & {
        data: {
          isSet: boolean;
          path?: string;
          directory?: string;
          filename?: string;
          size?: number;
          cid?: string;
          mimeType?: string;
        }
      }) => {
        if (!event.data) {
          // User skipped the upload
          console.log("uploadPicture.success. step was skipped.");
          return {
            isSet: false
          }
        } else {
          console.log("uploadPicture.success. done data is: ", event.data);
          return {
            isSet: true,
            ...event.data
          }
        }
      }
    }
  }
});

export const uploadPicture: ProcessDefinition<{
  targetDirectory: string;
  isOptional?: boolean;
  canGoBack?: boolean;
  strings?: {
    promptTitle: string,
    promptButton: string;
    promptBanner?: string;
  }
}, {
  /**
   * If the user decided to skip the upload then this property is 'false'.
   * All other properties are only set when 'isSet' == 'true'.
   */
  isSet: boolean;
  path?: string;
  directory?: string;
  filename?: string;
  size?: number;
  cid?: string;
  mimeType?: string;
}> = {
  name: "uploadPicture",
  stateMachine: <any>processDefinition
};