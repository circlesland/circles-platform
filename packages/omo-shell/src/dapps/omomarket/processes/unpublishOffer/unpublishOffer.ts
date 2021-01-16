import { createMachine} from "xstate";
import {strings} from "../../data/strings";
import {unpublishOfferService} from "./services/unpublishOfferService";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface UnpublishOfferContext extends ProcessContext {
  data: {
    offerName: ProcessArtifact;
  }
}

/**
 * Connect safe
 */
const str = strings.omomarket.processes.unpublishOffer;
const processDefinition = () => createMachine<UnpublishOfferContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "unpublishOffer"
      }
    },
    unpublishOffer: {
      entry: sendInProgressPrompt(str.bannerProgress),
      invoke: {
        id: 'unpublishOffer',
        src: unpublishOfferService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(str.successMessage),
          target: "success"
        }
      }
    },
    error: {
      entry: sendErrorPrompt,
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    success: {
      entry: sendSuccessPrompt,
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    stop: {
      type: "final"
    }
  }
});

export const unpublishOffer: ProcessDefinition = {
  name: "unpublishOffer",
  stateMachine: processDefinition
};
