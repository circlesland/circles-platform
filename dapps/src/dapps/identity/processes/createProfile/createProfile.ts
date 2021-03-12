import {OmoEvent} from "omo-events/dist/omoEvent";
import {createMachine, actions} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {textLine} from "omo-process/dist/artifacts/textLine";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {uploadAvatar} from "./uploadAvatar";
import {OmoCentral} from "omo-central/dist/omoCentral";
import {Profile} from "omo-central/dist/generated";
import {ProcessContext} from "../processContext";
import {Bubble} from "../../events/process/ipc/bubble";

const {send, sendParent, escalate} = actions;

export class CreateProfileContext extends ProcessContext {
  data: {
    firstName?: ProcessArtifact,
    lastName?: ProcessArtifact,
  }
}

const processDefinition = (progressView: any, successView: any, errorView: any) => createMachine<CreateProfileContext, any>({
  id: "createProfile",
  initial: "promptFirstName",
  states: {
    promptFirstName: {
      entry: sendParent((context) => {
        return <Bubble>{
          type: "process.ipc.bubble",
          tag: "testBubble",
          levels: 0,
          trace: [],
          wrappedEvent: {
            type: "process.prompt",
            title: "Please enter your first name",
            nextButtonTitle: "Next",
            canGoBack: false,
            hideNextButton: false,
            banner: {
              component: Banner,
              data: {
                text: "This name will be used for your public profile"
              }
            },
            data: {
              ...textLine("firstName", undefined, undefined, false)
            }
          }
        }
      }),
      on: {
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "promptLastName"
        }
      }
    },
    promptLastName: {
      entry: sendParent((context) => {
        return <Bubble>{
          type: "process.ipc.bubble",
          tag: "testBubble",
          levels: 0,
          trace: [],
          wrappedEvent: {
            type: "process.prompt",
            title: "Please enter your last name",
            nextButtonTitle: "Next",
            canGoBack: true,
            hideNextButton: false,
            banner: {
              component: Banner,
              data: {
                text: "This name will be used for your public profile"
              }
            },
            data: {
              ...textLine("lastName", undefined, undefined, true)
            }
          }
        }
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
        id: "uploadAvatar",
        src: uploadAvatar.stateMachine(progressView, successView, errorView),
        data: (context: ProcessContext) => {
          return {
            data: {}
          }
        },
        onError: "error",
        onDone: [{
          cond: (context, event: { type: string, data: any }) => {
            if (event.data instanceof Error) {
              console.log("createProfile.uploadAvatar returned an error: ", event.data);
              return true;
            }
            return false;
          },
          target: "error"
        }, {
          cond: (context, event: OmoEvent & { data: any }) => {
            return typeof event.data === "object";
          },
          target: "createProfile"
        }]
      },
      on: {
        "*": [{
          cond: (context, event: any) => event.sender === "uploadAvatar",
          actions: sendParent((context, event: any, meta) => {
            console.log("'createProfile' received event from child for outside (wildcard event handler): ", meta);
            return {
              ...event,
              type: event.type
            };
          })
        }, {
          actions: send((context, event: any, meta) => {
            console.log("'createProfile' received event from outside for child (wildcard event handler): ", meta);
            return {
              ...event,
              type: event.type
            };
          }, {
            to: "uploadAvatar"
          })
        }]
      }
    },
    createProfile: {
      invoke: {
        src: async (context, event: { data: { cid: string, mimeType: string } }) => {
          const api = await OmoCentral.instance.subscribeToResult();
          return await api.upsertProfile({
            omoFirstName: context.data.firstName.value,
            omoLastName: context.data.lastName.value,
            omoAvatarCid: event.data.cid,
            omoAvatarMimeType: event.data.mimeType
          });
        },
        onError: "error",
        onDone: "success",
      }
    },
    error: {
      type: 'final',
      // TODO: Make 'escalate' work
      entry: escalate((context, event: OmoEvent & { data: Error }) => event.data),
      /*
      data: (context, event: OmoEvent & { data: boolean }) => {
        console.log("createProfile.error", event.data);
        return event.data;
      }
       */
    },
    success: {
      type: 'final',
      data: (context, event: OmoEvent & { data: Profile }) => {
        console.log("createProfile.success", event.data);
        return event.data;
      }
    }
  }
});

export const createProfile: ProcessDefinition<void, Profile> = {
  name: "createProfile",
  stateMachine: <any>processDefinition
};