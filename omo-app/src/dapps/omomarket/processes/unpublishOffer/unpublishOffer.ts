import { createMachine} from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { OmoEvent } from "../../../../libs/o-events/omoEvent";
import { ProcessContext } from "../../../../libs/o-processes/interfaces/processContext";
import { ProcessArtifact } from "../../../../libs/o-processes/interfaces/processArtifact";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {strings} from "../../data/strings";
import {unpublishOfferService} from "./services/unpublishOfferService";

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
