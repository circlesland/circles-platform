import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {createMachine, actions} from "xstate";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {textLine} from "omo-process/dist/artifacts/textLine";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {choice} from "omo-process/dist/artifacts/choice";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {Offer} from "omo-central/dist/generated";
import {uploadPicture} from "../shell/imageUploader/uploadPicture";
import {ProcessContext} from "../processContext";
import {Bubble} from "../../events/process/ipc/bubble";
import {ipcSinker} from "../../patterns/ipcSinker";
import {ipc} from "../../patterns/ipc";
const {assign, send, sendParent, escalate} = actions;

export class CreateOfferContext extends ProcessContext {
  pictures: {
    cid:string,
    mimeType:string,
    filename:string
  }[] = []
  data: {
    productName: ProcessArtifact;
    productPrice: ProcessArtifact;
    productDescription: ProcessArtifact;
    productLocation: ProcessArtifact;
  }
}

const UPLOAD_ANOTHER_IMAGE_YES = "Yes";
const UPLOAD_ANOTHER_IMAGE_NO = "No";

const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<CreateOfferContext, OmoEvent>({
  id: "createOffer",
  initial: "promptName",
  states:{
    promptName: {
      id: "promptName",
      entry: [
        () => console.log("createOffer: promptName"),
        sendParent(<Bubble>{
          type: "process.ipc.bubble",
          tag: "testBubble",
          levels: 0,
          trace: [],
          wrappedEvent: {
            type: "process.prompt",
            title: "Please enter the title of your offer",
            nextButtonTitle: "Next",
            canGoBack: false,
            hideNextButton: false,
            data: {
              ...textLine("productName", undefined, undefined, false)
            }
          }
        })
      ],
      on: {
        "process.ipc.sinker": {
          actions: send((context, event:any) =>  event.wrappedEvent)
        },
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "uploadOfferPicture"
        }
      }
    },
    uploadOfferPicture: {
      on: {
        ...ipc("uploadOfferPicture")
      },
      entry: () => console.log("createOffer: uploadOfferPicture"),
      invoke: {
        id: "uploadOfferPicture",
        src: uploadPicture.stateMachine(progressView, successView, errorView),
        data: {
          targetDirectory: "public/Apps/MamaOmo/OmoSapien/offerPictures"
        },
        onError: "error",
        onDone: [{
          cond: (context, event: { type: string, data: any }) => {
            if (event.data instanceof Error) {
              console.log("createOffer.uploadOfferPicture returned an error: ", event.data);
              return true;
            }
            return false;
          },
          target: "error"
        }, {
          cond: (context, event: OmoEvent & { data: any }) => {
            return typeof event.data === "object";
          },
          actions: assign({
            pictures: (context, event) => {
              return context.pictures.concat(event.data);
            }
          }),
          target: "promptUploadAnotherImage"
        }]
      },
    },
    promptUploadAnotherImage: {
      entry: [
        () => console.log("createOffer: promptUploadAnotherImage"),
        sendParent((context) => {
          return <Bubble>{
            type: "process.ipc.bubble",
            tag: "testBubble",
            levels: 0,
            trace: [],
            wrappedEvent: {
              type: "process.prompt",
              title: "Do you want to upload another image?",
              nextButtonTitle: "Next",
              canGoBack: false,
              hideNextButton: false,
              banner: {
                component: Banner,
                data: {
                  text: `If you want to remove already uploaded pictured then you can do that later in the summary.`
                }
              },
              data: {
                ...choice("promptUploadAnotherImage", undefined, [
                  UPLOAD_ANOTHER_IMAGE_YES,
                  UPLOAD_ANOTHER_IMAGE_NO
                ])
              }
            }
        })
      ],
      on: {
        "process.continue": [{
          cond: (context, event:any) => {
            console.log("Menu selection:", event);
            return event.data["promptUploadAnotherImage"].value === UPLOAD_ANOTHER_IMAGE_YES
          },
          target: "uploadOfferPicture"
        }, {
          target: "success"
        }]
      }
    },

    error: {
      type: 'final',
      // TODO: Make 'escalate' work
      entry: escalate((context, event:OmoEvent&{data:Error}) => event.data),
      /*data: (context, event : OmoEvent & { data: boolean }) => {
        console.log("createOffer.error", event.data);
        return event.data;
      }*/
    },
    success: {
      type: 'final',
      data: (context, event : OmoEvent & { data: boolean }) => {
        console.log("createOffer.success. done data is: ", event.data);
        return event.data
      }
    }
  }
});

export const createOffer: ProcessDefinition<void, Offer> = {
  name: "createOffer",
  stateMachine: <any>processDefinition
};