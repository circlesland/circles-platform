import { createMachine} from "xstate";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import {strings} from "../../data/strings";
import {createOfferService} from "./services/createOfferService";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {sendPrompt} from "omo-process/dist/actions/sendPrompt/sendPrompt";
import {textLine} from "omo-process/dist/artifacts/textLine";
import {storePromptResponse} from "omo-process/dist/actions/storePromptResponse";
import {file} from "omo-process/dist/artifacts/file";
import {o} from "omo-process/dist/artifacts/o";
import {text} from "omo-process/dist/artifacts/text";
import {location} from "omo-process/dist/artifacts/location";
import {sendInProgressPrompt} from "omo-process/dist/actions/sendPrompt/sendInProgressPrompt";
import {setError} from "omo-process/dist/actions/setError";
import {setProcessResult} from "omo-process/dist/actions/setProcessResult";
import {sendErrorPrompt} from "omo-process/dist/actions/sendPrompt/sendErrorPrompt";
import {sendSuccessPrompt} from "omo-process/dist/actions/sendPrompt/sendSuccessPrompt";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";

export interface CreateOfferContext extends ProcessContext {
  data: {
    productName: ProcessArtifact;
    productPicture: ProcessArtifact;
    productPrice: ProcessArtifact;
    productDescription: ProcessArtifact;
    productLocation: ProcessArtifact;
  }
}

/**
 * Connect safe
 */
const str = strings.omomarket.processes.createOffer;
const processDefinition = () => createMachine<CreateOfferContext, OmoEvent>({
  initial: "idle",
  states: {

    idle: {
      on: {
        "process.continue": "promptName"
      }
    },
    promptName: {
      entry: sendPrompt((context) => {
        return {
          title: str.titleProductName(),
          nextButtonTitle: str.buttonProductName(),
          banner: {
            component: Banner,
            data: {
              text: str.bannerProductName()
            }
          },
          artifacts: {
            ...textLine("productName", undefined, undefined, false)
          }
        }
      }),
      on: {
        "process.continue": {
          actions: storePromptResponse,
          target: "promptPicture"
        },
        "process.cancel": "stop"
      }
    },
    promptPicture: {
      entry: sendPrompt((context) => {
        return {
          canGoBack: true,
          title: str.titleProductPicture(),
          nextButtonTitle: str.buttonProductPicture(),
          banner: {
            component: Banner,
            data: {
              text: str.bannerProductPicture()
            }
          },
          artifacts: {
            ...file("productPicture", undefined, undefined, true)
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptName"
        },
        "process.continue": {
          actions: storePromptResponse,
          target: "promptPrice"
        },
        "process.cancel": "stop"
      }
    },
    promptPrice: {
      entry: sendPrompt((context) => {
        return {
          title: str.titleProductPrice(),
          nextButtonTitle: str.buttonProductPrice(),
          canGoBack: true,
          banner: {
            component: Banner,
            data: {
              text: str.bannerProductPrice()
            }
          },
          artifacts: {
            ...o("productPrice")
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptPicture"
        },
        "process.continue": {
          actions: storePromptResponse,
          target: "promptDescription"
        },
        "process.cancel": "stop"
      }
    },
    promptDescription: {
      entry: sendPrompt((context) => {
        return {
          title: str.titleProductDescription(),
          nextButtonTitle: str.buttonProductDescription(),
          canGoBack: true,
          banner: {
            component: Banner,
            data: {
              text: str.bannerProductDescription()
            }
          },
          artifacts: {
            ...text("productDescription", undefined, undefined, false)
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptPrice"
        },
        "process.continue": {
          actions: storePromptResponse,
          target: "promptLocation"
        },
        "process.cancel": "stop"
      }
    },
    promptLocation: {
      entry: sendPrompt((context) => {
        return {
          title: str.titleProductLocation(),
          nextButtonTitle: str.buttonProductLocation(),
          canGoBack: true,
          banner: {
            component: Banner,
            data: {
              text: str.bannerProductLocation()
            }
          },
          artifacts: {
            ...location("productLocation", undefined, undefined, false)
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptDescription"
        },
        "process.continue": {
          actions: storePromptResponse,
          target: "summarize"
        },
        "process.cancel": "stop"
      }
    },
    summarize: {
      entry: sendPrompt((context: CreateOfferContext) => {
        return {
          title: str.titleSummary(),
          nextButtonTitle: str.buttonSummary(),
          canGoBack: true,
          banner: {
            component: Banner,
            data: {
              text: str.bannerSummary()
            }
          },
          artifacts: {
            ...textLine("productName", undefined, true),
            ...file("productPicture", undefined, true),
            ...o("productPrice", undefined, true),
            ...text("productDescription", undefined, true),
            ...location("productLocation", undefined, true),
          }
        }
      }),
      on: {
        "process.back": "promptLocation",
        "process.cancel": "stop",
        "process.continue": "createOffer"
      }
    },
    createOffer: {
      entry: sendInProgressPrompt(str.bannerProgress),
      invoke: {
        id: 'createOffer',
        src: createOfferService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setProcessResult(strings.omomarket.processes.createOffer.successMessage),
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

export const createOffer: ProcessDefinition = {
  name: "createOffer",
  stateMachine: processDefinition
};
