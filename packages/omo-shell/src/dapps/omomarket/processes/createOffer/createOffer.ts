import { createMachine} from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import { OmoEvent } from "../../../../libs/o-events/omoEvent";
import { ProcessContext } from "../../../../libs/o-processes/interfaces/processContext";
import { ProcessArtifact } from "../../../../libs/o-processes/interfaces/processArtifact";
import { storePromptResponse } from "../../../../libs/o-processes/actions/storePromptResponse";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setProcessResult } from "../../../../libs/o-processes/actions/setProcessResult";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { textLine } from "../../../../libs/o-processes/artifacts/textLine";
import { file } from "../../../../libs/o-processes/artifacts/file";
import {sendSuccessPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendSuccessPrompt";
import {strings} from "../../data/strings";
import {createOfferService} from "./services/createOfferService";
import {o} from "../../../../libs/o-processes/artifacts/o";
import {text} from "../../../../libs/o-processes/artifacts/text";
import {location} from "../../../../libs/o-processes/artifacts/location";

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
const processDefinition = () => createMachine<CreateOfferContext, OmoEvent | { type: "evaluateChoice" }>({
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
