import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {actions, createMachine} from "xstate";
import * as IPFS from "ipfs";
import {uploadPicture} from "./uploadPicture";
const {escalate} = actions;

export interface UploadPicturesContext extends ProcessContext {
  pictures: {
    path: string;
    directory: string;
    filename: string;
    size: number;
    cid: string;
    mimeType: string;
  }[]
}

const processDefinition = (progressView: any, successView: any, errorView: any) => {
  return createMachine<UploadPicturesContext, OmoEvent & { data?: any }>({
    id: "uploadPictures",
    initial: "gallery",
    states: {
      gallery: {
        id: "gallery",
        initial: "overview",
        states: {
          overview: {
            on: {
              "shell.interaction.mutation.add": "#uploadPicture",
              "shell.interaction.selection.start": "select"
            }
          },
          select: {
            on: {
              "shell.interaction.selection.items.toggleSelected": {
                actions: () => console.log("shell.interaction.selection.items.toggleSelected")
              },
              "shell.interaction.selection.finish":  "overview",
              "shell.interaction.selection.cancel": "overview",
              "shell.interaction.mutation.selection.delete": "overview"
            }
          }
        }
      },
      uploadPicture: {
        id: "uploadPicture",
        invoke: {
          src: uploadPicture.stateMachine(progressView, successView, errorView),
          onDone: "#gallery."
        }
      },
      error: {
        type: 'final',
        entry: [
          () => console.log("uploadPictures: error"),
          escalate((context, event:OmoEvent&{data:Error}) => event.data)
        ]
      },
      success: {
        entry: () => console.log("uploadPictures: success"),
        type: 'final',
        data: (context, event : OmoEvent & { data: any }) => {
          console.log("uploadPictures.success. done data is: ", event.data);
          return event.data
        }
      }
    }
  });
}

/**
 * Run a function that requires the user's fission FileSystem as argument,
 */
export const uploadPictures: ProcessDefinition<(ipfs:IPFS.IPFS) => Promise<any>, any> = {
  name: "uploadPictures",
  stateMachine: <any>processDefinition
};