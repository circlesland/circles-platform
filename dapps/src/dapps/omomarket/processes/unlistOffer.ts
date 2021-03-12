import { createMachine} from "xstate";
import {strings} from "../data/strings";
import {unlistOfferService} from "../services/unlistOfferService";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface UnlistOfferContext extends ProcessContext {
  data: {
    offerName: ProcessArtifact;
  }
}

/**
 * Connect safe
 */
const str = strings.omomarket.processes.unlistOffer;
const processDefinition = (progressView:any, successView:any, errorView:any) => createMachine<UnlistOfferContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "unlistOffer"
      }
    },
    unlistOffer: {
      entry: <any>sendInProgressPrompt(progressView, str.bannerProgress),
      invoke: <any>{
        id: 'unlistOffer',
        src: unlistOfferService,
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
      entry: <any>sendErrorPrompt(errorView),
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    success: {
      entry: <any>sendSuccessPrompt(successView),
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

export const unlistOffer: ProcessDefinition<any,any> = {
  name: "unlistOffer",
  stateMachine:<any> processDefinition
};
