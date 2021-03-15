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
import {ipc} from "../../patterns/ipc";
import {Bubble} from "../../events/process/ipc/bubble";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {OmoSafeState} from "../../../safe/manifest";

const {sendParent, send, escalate, assign} = actions;

export class UpsertProfileContext extends ProcessContext {
  data: {
    firstName?: ProcessArtifact,
    lastName?: ProcessArtifact,
    avatarCid?: ProcessArtifact,
    avatarMimeType?: ProcessArtifact,
  }
}

const processDefinition = (progressView: any, successView: any, errorView: any) => createMachine<UpsertProfileContext, any>({
  id: "upsertProfile",
  initial: "checkFirstName",
  states: {
    checkFirstName: {
      entry: send({type:"process.continue"}),
      on: {
        "*": [{
          cond: (context) => {
            return !context.data.firstName?.value || context.data.firstName.changed
          },
          target: "promptFirstName"
        }, {
          target: "checkLastName"
        }]
      }
    },
    promptFirstName: {
      entry: sendParent(<Bubble>{
        type: "process.ipc.bubble",
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
      }),
      on: {
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "checkLastName"
        }
      }
    },
    checkLastName: {
      entry: send({type:"process.continue"}),
      on: {
        "*": [{
          cond: (context) => {
            return !context.data.lastName?.value || context.data.lastName.changed
          },
          target: "promptLastName"
        }, {
          target: "checkAvatar"
        }]
      }
    },
    promptLastName: {
      entry: sendParent((context) => {
        return {
          type: "process.ipc.bubble",
          levels: 0,
          trace: [],
          wrappedEvent: {
            type: "process.prompt",
            title: "Please enter your last name",
            nextButtonTitle: "Next",
            canGoBack: context.data.firstName?.changed,
            hideNextButton: false,
            banner: {
              component: Banner,
              data: {
                text: "This name will be used for your public profile"
              }
            },
            data: {
              ...textLine("lastName", undefined, undefined, false)
            }
          }
        }
      }),
      on: {
        "process.back": {
          target: "checkFirstName"
        },
        "process.continue": {
          actions: <any>storePromptResponse,
          target: "checkAvatar"
        }
      }
    },
    checkAvatar: {
      entry: send({type:"process.continue"}),
      on: {
        "*": [{
          cond: (context) => {
            return !context.data.avatarCid?.value
          },
          target: "uploadAvatar"
        }, {
          target: "upsertProfile"
        }]
      }
    },
    uploadAvatar: {
      on: {
        ...ipc("uploadAvatar"),

        // TODO: Enable the 'back' button from the 'uploadAvatar' prompt (child process will need a reset on next continue)
        /*
        "process.ipc.sinker": {
          cond: (context, event) => event.wrappedEvent.type === "process.back",
          actions: send(new Cancel(), {to: "uploadAvatar"}),
          target: "checkLastName"
        },
         */
      },
      invoke: {
        id: "uploadAvatar",
        src: uploadAvatar.stateMachine(progressView, successView, errorView),
        onError: "error",
        onDone: {
          actions: assign({
            // TODO: Fix 'any'
            data: (context:any, event:any) => {
              return {
                ...context.data,
                avatarCid: {
                  type: "text",
                  key: "avatarCid",
                  value: event.data.cid
                },
                avatarMimeType: {
                  type: "text",
                  key: "avatarMimeType",
                  value: event.data.mimeType
                }
              }
            }
          }),
          target: "upsertProfile"
        }
      }
    },
    upsertProfile: {
      invoke: {
        src: async (context) => {
          const api = await OmoCentral.instance.subscribeToResult();
          const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
          return await api.upsertProfile({
            omoFirstName: context.data.firstName.value,
            omoLastName: context.data.lastName.value,
            omoAvatarCid: context.data.avatarCid.value,
            omoAvatarMimeType: context.data.avatarMimeType.value,
            circlesAddress: safeState?.mySafeAddress
          });
        },
        onError: "error",
        onDone: "success",
      }
    },
    error: {
      type: 'final',
      entry: escalate((context, event: OmoEvent & { data: Error }) => event.data)
    },
    success: {
      type: 'final',
      data: (context, event: OmoEvent & { data: Profile }) => {
        console.log("upsertProfile.success", event.data);
        return event.data;
      }
    }
  }
});

export const upsertProfile: ProcessDefinition<void, Profile> = {
  name: "upsertProfile",
  stateMachine: <any>processDefinition
};