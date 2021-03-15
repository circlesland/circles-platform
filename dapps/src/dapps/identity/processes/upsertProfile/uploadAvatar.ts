import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {createMachine, actions} from "xstate";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-avataaars-sprites";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {ProcessContext} from "../processContext";
import {uploadPicture} from "../shell/imageUploader/uploadPicture";
import {ensureIsAuthenticated} from "../../utils/omo/fission/auth/ensureIsAuthenticated";
import {uploadPublicFile} from "../../capabilitites/fission/fs/uploadPublicFile";
import {ipc} from "../../patterns/ipc";
const {escalate, send} = actions;

const avatarDirectory = "public/Apps/MamaOmo/OmoSapien/Avatars/";

export class UploadAvatarContext extends ProcessContext {
  data: {
    avatar: ProcessArtifact
  }
}

const processDefinition = (progressView: any, successView: any, errorView: any) => createMachine<UploadAvatarContext, OmoEvent>({
  id: "uploadAvatar",
  initial: "uploadAvatar",
  states: {
    uploadAvatar: {
      on: {
        ...ipc("uploadAvatar")
      },
      entry: () => console.log("uploadAvatar: uploadAvatar"),
      invoke: {
        id: "uploadAvatar",
        src: uploadPicture.stateMachine(progressView, successView, errorView),
        data: {
          isOptional: true, // The user can skip the step. An auto generated avatar will be used instead.
          canGoBack: false, // TODO: Fix 'canGoBack' for child processes
          targetDirectory: avatarDirectory,
          strings: {
            promptTitle: "Please upload an avatar",
            promptButton: "Upload",
            promptBanner: "This picture will be used for your public profile. If you skip the step we generate an avatar for you."
          }
        },
        onError: "error",
        onDone: [{
          cond: (context, event) => event.data.isSet,
          target: "finished"
        }, {
          // If the user skipped the step we generate an avatar
          target: "generateAvatar"
        }]
      }
    },
    generateAvatar: {
      entry: () => console.log("uploadAvatar: generateAvatar"),
      invoke: {
        // First ensure that the user is authenticated the use the username to generate a unique avatar for the user.
        src: ensureIsAuthenticated.stateMachine(progressView, successView, errorView),
        onError: "error",
        onDone: {
          actions: send((context, event) => {
            const avatars = new Avatars(sprites);
            const svg = avatars.create(event.data.username);
            const bytes = Buffer.from(svg, "utf-8");
            return <OmoEvent>{
              type: "process.continue",
              data: bytes
            };
          })
        },
      },
      on: {
        "process.continue": {
          target: "uploadGeneratedAvatar"
        }
      }
    },
    uploadGeneratedAvatar: {
      entry: () => console.log("uploadAvatar: uploadGeneratedAvatar"),
      invoke: {
        src: uploadPublicFile.stateMachine(progressView, successView, errorView),
        data: {
          directory: avatarDirectory,
          createDirectory: true,
          filename: undefined,
          bytes: (context, event) => event.data,
          mimeType: "image/svg+xml"
        },
        onError: "error",
        onDone: "finished"
      }
    },
    error: {
      type: 'final',
      entry: escalate((context, event: OmoEvent & { data: Error }) => event.data)
    },
    finished: {
      type: 'final',
      // use the result of 'validateUcan' as machine result
      data: (context, event: OmoEvent & { data: { filename: string, mimeType: string, cid: string } }) => {
        console.log("uploadAvatar.finished. done data is: ", event.data);
        return event.data
      }
    }
  }
});

export const uploadAvatar: ProcessDefinition<Buffer, { filename: string, mimeType: string, cid: string }> = {
  name: "uploadAvatar",
  stateMachine: <any>processDefinition
};