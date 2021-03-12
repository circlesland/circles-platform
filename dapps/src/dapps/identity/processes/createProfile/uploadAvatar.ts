import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {createMachine, actions} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {file} from "omo-process/dist/artifacts/file";
const {sendParent, escalate} = actions;

import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import {uploadFileAndGetCid} from "omo-fission/dist/fissionUtil";
import {Generate} from "omo-utils/dist/generate";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {ProcessContext} from "../processContext";
import {uploadPicture} from "../shell/imageUploader/uploadPicture";
import {Bubble} from "../../events/process/ipc/bubble";

function getAvatarData(fissionUsername:string, bytes:Buffer) : {
  bytes:Buffer,
  mimeType: string
} {
  let avatarMimeType = "image/png";
  if (!bytes) {
    let avatars = new Avatars(sprites);
    let svg = avatars.create(fissionUsername);
    avatarMimeType = "image/svg+xml";
    bytes = Buffer.from(svg, "utf-8");
  }
  const mimeType = avatarMimeType;
  return {
    bytes,
    mimeType
  }
}

async function uploadAvatarData(avatarData:{ bytes:Buffer, mimeType: string }, filename?:string) {
  filename = filename ?? Generate.randomHexString();
  const cid = await uploadFileAndGetCid(
    // TODO: Make path configurable
    "public/Apps/MamaOmo/OmoSapien/Avatars/",
    filename,
    avatarData.bytes);

  return {
    filename,
    mimeTime: avatarData.mimeType,
    cid
  }
}

export class UploadAvatarContext extends ProcessContext {
  data: {
    avatar: ProcessArtifact
  }
}

const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<UploadAvatarContext, OmoEvent>({
  id: "uploadAvatar",
  initial: "promptAvatar",
  states:{
    uploadAvatar_: {
      invoke: {
        src: uploadPicture.stateMachine(progressView, successView, errorView),
        data: {
          targetDirectory: "public/Apps/MamaOmo/OmoSapien/Avatars/",
          strings: {
            promptTitle: "Please upload an avatar",
            promptButton: "Upload",
            promptBanner: "This picture will be used for your public profile. If you skip the step we generate an avatar for you."
          }
        },
        onDone: "checkUpload",
        onError: ""
      }
    },
    promptAvatar: {
      entry: sendParent((context) => {
          return <Bubble>{
            type: "process.ipc.bubble",
            tag: "testBubble",
            levels: 0,
            trace: [],
            wrappedEvent: {
              sender: "uploadAvatar",
              type: "process.prompt",
              title: "Please upload an avatar",
              nextButtonTitle: "Next",
              canGoBack: true,
              hideNextButton: false,
              banner: {
                component: Banner,
                data: {
                  text: `This picture will be used for your public profile. If you skip the step we generate an avatar for you.`
                }
              }
            },
            data: {
              ...file("avatar", undefined, undefined, true)
            }
          }
      }, {
        id: "abc"
      }),
      on: {
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "uploadAvatar"
        }
      }
    },
    uploadAvatar: {
      invoke: {
        src: async (context) => {
          const avatarData = getAvatarData(context.fissionAuthState.username, context.data.avatar.value);
          console.log("uploadAvatar.uploadAvatar - avatarData:", avatarData);
          const uploadedAvatarData = await uploadAvatarData(avatarData);
          console.log("uploadAvatar.uploadAvatar - uploadedAvatarData:", uploadedAvatarData);
          return uploadedAvatarData;
        },
        onError: "error",
        onDone: "finished"
      }
    },
    error: {
      type: 'final',
      // TODO: Make 'escalate' work
      entry: escalate((context, event:OmoEvent&{data:Error}) => event.data),
      /*data: (context, event : OmoEvent & { data: boolean }) => {
        console.log("uploadAvatar.error", event.data);
        return event.data;
      }
       */
    },
    finished: {
      type: 'final',
      // use the result of 'validateUcan' as machine result
      data: (context, event : OmoEvent & { data: { filename:string, mimeType: string, cid:string } }) => {
        console.log("uploadAvatar.finished. done data is: ", event.data);
        return event.data
      }
    }
  }
});

export const uploadAvatar: ProcessDefinition<Buffer, { filename:string, mimeType: string, cid:string }> = {
  name: "uploadAvatar",
  stateMachine: <any>processDefinition
};