import {createMachine, send} from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import { push } from "svelte-spa-router";
import { OmoEvent } from "../../../../libs/o-events/omoEvent";
import { ProcessContext } from "../../../../libs/o-processes/interfaces/processContext";
import { ProcessArtifact } from "../../../../libs/o-processes/interfaces/processArtifact";
import { setError } from "../../../../libs/o-processes/actions/setError";
import { setResult } from "../../../../libs/o-processes/actions/setResult";
import { strings } from "../../data/strings";
import { sendPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import { sendInProgressPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import { sendErrorPrompt } from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import { ethereumAddress } from "../../../../libs/o-processes/artifacts/ethereumAddress";
import {BN} from "ethereumjs-util";
import {deploySafeService} from "./services/deploySafeService";
import {generateFundLink} from "./actions/generateFundLink";
import {createPrivateKeyService} from "./services/createPrivateKeyService";
import {choice} from "../../../../libs/o-processes/artifacts/choice";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {connectSafeService} from "./services/connectSafeService";

export interface ConnectSafeContext extends ProcessContext {
  data: {
    privateKey?: ProcessArtifact
    safeAddress?: ProcessArtifact,
    fundLink?:ProcessArtifact,
    safeChoice?: ProcessArtifact
  }
}

/**
 * Connect safe
 */
const str = strings.safe.processes.createSafe;
const processDefinition = () => createMachine<ConnectSafeContext, OmoEvent>({
  initial: "newOrExistingSafe",
  states: {

    newOrExistingSafe: {
      entry: sendPrompt({
        title: str.titleConnectOrCreateSafe(),
        hideNextButton: true,
        banner: {
          component: Banner,
          data: {
            text: str.bannerConnectOrCreateSafe()
          }
        },
        artifacts: {
          ...choice("safeChoice", undefined, [
            str.choiceConnectSafe(),
            str.choiceCreateSafe()])
        }
      }),
      on: {
        "process.continue": {
          actions: [
            storePromptResponse,
            send({
              type: "process.triggerSelf"
            })
          ]
        },
        "process.triggerSelf": [{
          target: 'promptSafeAddress',
          cond: (context:ConnectSafeContext) => {
            return context.data.safeChoice.value === str.choiceConnectSafe()
          }
        },{
          target: 'checkAccount',
          cond: (context:ConnectSafeContext) => {
            return context.data.safeChoice.value === str.choiceCreateSafe()
          }
        }],
        "process.cancel": "stop"
      }
    },

    promptSafeAddress: {
      entry: [
        () => {
          console.log("promptSafeAddress")
        },
        sendPrompt({
          title: str.titleSafeAddress(),
          nextButtonTitle: str.buttonSafeAddress(),
          banner: {
            component: Banner,
            data: {
              text: str.bannerSafeAddress()
            }
          },
          artifacts: {
            ...ethereumAddress("safeAddress")
          }
        })
      ],
      on: {
        "process.continue": {
          actions: storePromptResponse,
          target: "promptPrivateKey"
        },
        "process.cancel": "stop"
      }
    },
    promptPrivateKey: {
      entry: sendPrompt({
        title: str.titleSeedPhrase(),
        nextButtonTitle: "Connect safe",
        canGoBack: true,
        banner: {
          component: Banner,
          data: {
            text: str.bannerSeedPhrase()
          }
        },
        artifacts: {
          privateKey: {
            key: "privateKey",
            type: "keyphrase",
          }
        }
      }),
      on: {
        "process.back": {
          target: "promptSafeAddress"
        },
        "process.continue": {
          actions: storePromptResponse,
          target: "connectSafe"
        },
        "process.cancel": "stop"
      }
    },
    connectSafe: {
      entry: sendInProgressPrompt(str.titleProgress),
      invoke: {
        id: 'connectSafe',
        src: connectSafeService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          target: "checkFunding"
        }
      }
    },







    checkAccount: {
      entry: send({
        type: "process.continue"
      }),
      on: {
        "process.continue": [{
          target: "createPrivateKey",
          cond: (context) => !context.environment.me.myAddress
        }, {
          target: "checkFunding",
          cond: (context) => !!context.environment.me.myAddress
        }]
      }
    },
    createPrivateKey: {
      entry: sendInProgressPrompt(str.titleInitializing),
      invoke: {
        id: 'createPrivateKey',
        src: createPrivateKeyService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setResult(str.successCreateSafe),
          target: "generateFundLink"
        }
      }
    },
    checkFunding: {
      entry: send({
        type: "process.continue"
      }),
      on: {
        "process.continue": [{
          cond: (context) => context.environment.me.myAddressXDaiBalance.gte(new BN("1234")),
          target: "checkSafe"
        },{
          cond: (context) => context.environment.me.myAddressXDaiBalance.lt(new BN("1234")),
          target: "generateFundLink"
        }]
      }
    },
    checkSafe: {
      entry: send({
        type: "process.continue"
      }),
      on: {
        "process.continue": [{
          cond: (context) => !context.environment.me.mySafe,
          target: "deploySafe"
        },{
          cond: (context) => !!context.environment.me.mySafe,
          target: "success"
        }]
      }
    },
    deploySafe: {
      entry: sendInProgressPrompt(str.progressCreateSafe),
      invoke: {
        id: 'deploySafe',
        src: deploySafeService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setResult(str.successCreateSafe),
          target: "success"
        }
      }
    },
    generateFundLink: {
      entry: [
        generateFundLink,
        sendPrompt({
          title: str.titleGenerateFundLink(),
          nextButtonTitle: str.buttonGenerateFundLink(),
          banner: {
            component: Banner,
            data: {
              text: str.bannerGenerateFundLink()
            }
          },
          artifacts: {
            ...ethereumAddress("fundLink", undefined, true)
          }
        })
    ],
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    success: {
      type: "final",
      entry: () => push('#/safe/transactions')
    },
    error: {
      entry: sendErrorPrompt,
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

export const connectSafe: ProcessDefinition = {
  name: "connectSafe",
  stateMachine: processDefinition
};
