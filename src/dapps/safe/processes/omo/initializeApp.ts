/*import { createMachine, send } from "xstate";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import Banner from "../../../../libs/o-views/atoms/Banner.svelte"
import JumpstartIntro from "../../views/molecules/JumpstartIntro.svelte"
import { push } from "svelte-spa-router";
import { BN } from "ethereumjs-util";
import Announcement from "../../../../libs/o-views/molecules/Announcement.svelte";
import {storePromptResponse} from "../../../../libs/o-processes/actions/storePromptResponse";
import {ShowNotification} from "../../../../libs/o-events/showNotification";
import {textLine} from "../../../../libs/o-processes/artifacts/textLine";
import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {ProcessArtifact} from "../../../../libs/o-processes/interfaces/processArtifact";
import {strings} from "../../data/strings";
import {OmoEvent} from "../../../../libs/o-events/omoEvent";
import {sendPrompt, sendShellEvent} from "../../../../libs/o-processes/actions/sendPrompt/sendPrompt";
import {text} from "../../../../libs/o-processes/artifacts/text";
import {ethereumAddress} from "../../../../libs/o-processes/artifacts/ethereumAddress";
import {sendInProgressPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendInProgressPrompt";
import {sendErrorPrompt} from "../../../../libs/o-processes/actions/sendPrompt/sendErrorPrompt";
import {setError} from "../../../../libs/o-processes/actions/setError";
import {setResult} from "../../../../libs/o-processes/actions/setResult";
import {connectSafeService} from "../../services/connectSafeService";
import {createPrivateKeyService} from "../../services/createPrivateKeyService";
import {deploySafeService} from "../../services/deploySafeService";
import {fundSafeService} from "../../services/fundSafeService";
import {hubSignupService} from "../../services/hubSignupService";

export interface InitializeAppContext extends ProcessContext {
  data: {
    privateKey?: ProcessArtifact
    privateKeyPhrase?: ProcessArtifact
    safeAddress?: ProcessArtifact,
    fundLink?: ProcessArtifact,
    safeChoice?: ProcessArtifact,
    tokenAddress?: ProcessArtifact
  }
}

const str = strings.safe.processes.initializeApp;
const processDefinition = () => createMachine<InitializeAppContext, OmoEvent>({
  initial: "idle",
  states: {
    idle: {
      on: {
        "process.continue": "hasAccount"
      }
    },
    hasAccount: {
      entry: send({
        type: "process.triggerSelf"
      }),
      on: {
        "process.triggerSelf": [{
          cond: "noAccount",
          target: 'createOrImportSafe'
        }, {
          cond: "hasSafe",
          target: 'checkSafeXDaiBalance'
        }, {
          cond: "hasAccount",
          target: 'checkAccount'
        }]
      }
    },
    createOrImportSafe: {
      entry: "choiceCreateOrImportSafe",
      on: {
        "process.continue": {
          actions: [
            "storePromptResponse",
            send({
              type: "process.triggerSelf"
            })
          ]
        },
        "process.triggerSelf": [{
          target: 'promptSafeAddress',
          cond: "choiceConnectSafe"
        }, {
          target: 'checkAccount',
          cond: "choiceCreateSafe"
        }],
        "process.cancel": "stop"
      }
    },
    promptSafeAddress: {
      entry: "askForSafeAddress",
      on: {
        "process.continue": {
          actions: "storePromptResponse",
          target: "promptPrivateKey"
        },
        "process.cancel": "stop"
      }
    },
    promptPrivateKey: {
      entry: "askForPrivateKey",
      on: {
        "process.back": {
          target: "promptSafeAddress"
        },
        "process.continue": {
          actions: "storePromptResponse",
          target: "connectSafe"
        },
        "process.cancel": "stop"
      }
    },
    connectSafe: {
      entry: "showConnectSafeInProgress",
      invoke: {
        id: 'connectSafe',
        src: "connectSafeService",
        onError: {
          actions: "setError",
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
          cond: "noAccount"
        }, {
          target: "checkFunding",
          cond: "hasAccount"
        }]
      }
    },
    createPrivateKey: {
      entry: "showCreatePrivateKeyInProgress",
      invoke: {
        id: 'createPrivateKey',
        src: "createPrivateKeyService",
        onError: {
          actions: "setError",
          target: "error"
        },
        onDone: {
          actions: "setCreatePrivateKeyResult",
          target: "exportPassphrase"
        }
      }
    },
    exportPassphrase: {
      entry: sendPrompt((context) => {
        return {
          title: str.titleBackupKey(),
          nextButtonTitle: str.buttonBackupKey(),
          banner: {
            component: Banner,
            data: {
              text: str.bannerBackupKey()
            }
          },
          artifacts: {
            ...text("privateKeyPhrase", undefined, true)
          }
        }
      }),
      on: {
        "process.continue": "generateFundLink"
      }
    },
    checkFunding: {
      entry: send({
        type: "process.continue"
      }),
      on: {
        "process.continue": [{
          cond: "accountHasEnoughBalance",
          target: "checkSafe"
        }, {
          cond: "accountHasNotEnoughBalance",
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
          cond: "noSafe",
          target: "deploySafe"
        }, {
          cond: "hasSafe",
          target: "checkSafeXDaiBalance"
        }]
      }
    },
    deploySafe: {
      entry: "showDeploySafeInProgress",
      invoke: {
        id: 'deploySafe',
        src: "deploySafeService",
        onError: {
          actions: "setError",
          target: "error"
        },
        onDone: {
          actions: "setDeploySafeResult",
          target: "checkSafeXDaiBalance"
        }
      }
    },
    checkSafeXDaiBalance: {
      entry: send({
        type: "process.continue"
      }),
      on: {
        "process.continue": [{
          cond: "safeHasNotEnoughBalance",
          target: "fundSafe"
        }, {
          cond: "safeHasEnoughBalance",
          target: "checkToken"
        }]
      }
    },
    fundSafe: {
      entry: "showFundSafeInProgress",
      invoke: {
        id: 'fundSafe',
        src: "fundSafeService",
        onError: {
          actions: "setError",
          target: "error"
        },
        onDone: {
          actions: "setFundSafeResult",
          target: "checkToken"
        }
      }
    },
    checkToken: {
      entry: [
        send({
          type: "process.continue"
        })
      ],
      on: {
        "process.continue": [{
          cond: "noToken",
          target: "hubSignup"
        }, {
          cond: "hasToken",
          target: "success"
        }]
      }
    },
    hubSignup: {
      entry: "showHubSignupInProgress",
      invoke: {
        id: 'hubSignup',
        src: "hubSignupService",
        onError: {
          actions: "setError",
          target: "error"
        },
        onDone: {
          actions: "setHubSignupResult",
          target: "success"
        }
      }
    },
    generateFundLink: {
      entry: [
        "generateFundLink",
        "sendFundLinkNotification",
        "showFundLink"
      ],
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    success: {
      type: "final",
      entry: "navigateToSafe"
    },
    error: {
      entry: "sendErrorPrompt",
      on: {
        "process.continue": "stop",
        "process.cancel": "stop"
      }
    },
    stop: {
      type: "final"
    }
  }
}, {
  guards: {
    noAccount: (context) => !context.environment.me.myAddress,
    hasAccount: (context) => !!context.environment.me.myAddress,
    noSafe: (context) => !context.environment.me.mySafe,
    hasSafe: (context) => !!context.environment.me.mySafe,
    noToken: (context) => !context.environment.me.myToken,
    hasToken: (context) => !!context.environment.me.myToken,
    choiceCreateSafe: (context) => true, // context.data.safeChoice.value === str.choice_wantToReuseMyExistingPrivateKey(),
    choiceConnectSafe: (context) => true, //context.data.safeChoice.value === str.choice_alreadyGotCircles(),
    accountHasEnoughBalance: (context) => context.environment.me.myAddressXDaiBalance.gte(new BN(context.environment.eth.web3.utils.toWei("0.02", "ether"))),
    accountHasNotEnoughBalance: (context) => context.environment.me.myAddressXDaiBalance.lt(new BN(context.environment.eth.web3.utils.toWei("0.02", "ether"))),
    safeHasEnoughBalance: (context) => context.environment.me.mySafeXDaiBalance.gte(new BN(context.environment.eth.web3.utils.toWei("0.0045", "ether"))),
    safeHasNotEnoughBalance: (context) => !context.environment.me.mySafeXDaiBalance.gte(new BN(context.environment.eth.web3.utils.toWei("0.0045", "ether"))),
  },
  actions: {
    storePromptResponse: storePromptResponse,
    choiceCreateOrImportSafe: sendPrompt((context) => {
      return null
    }),
    askForSafeAddress: sendPrompt((context) => {
      return {
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
      }
    }),
    askForPrivateKey: sendPrompt((context) => {
      return {
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
      }
    }),
    showConnectSafeInProgress: sendInProgressPrompt(str.titleProgress),
    setError: setError,
    sendErrorPrompt: sendErrorPrompt,
    showCreatePrivateKeyInProgress: sendInProgressPrompt(str.progressCreatePrivateKey),
    setCreatePrivateKeyResult: setResult(str.successCreatePrivateKey),
    showDeploySafeInProgress: sendInProgressPrompt(str.progressDeploySafe),
    setDeploySafeResult: setResult(str.successDeploySafe),
    showFundSafeInProgress: sendInProgressPrompt(str.progressFundSafe),
    setFundSafeResult: setResult(str.successFundSafe),
    showHubSignupInProgress: sendInProgressPrompt(str.progressHubSignup),
    setHubSignupResult: setResult(str.successHubSignup),
    // generateFundLink: generateFundLink,
    sendFundLinkNotification: sendShellEvent(new ShowNotification(Announcement, {
      data: {
        text: "Please fund your account with xDai to fully use the app",
        button: "Get xDai"
      },
      action: {
        link: "http://deine.mudda.com"
      }
    }
    )),
    showFundLink: sendPrompt((context: InitializeAppContext) => {
      return {
        title: str.titleGenerateFundLink(),
        nextButtonTitle: str.buttonGenerateFundLink(),
        hideNextButton: true,
        banner: {
          component: JumpstartIntro,
          data: {
            header: str.fundLinkHeader(context),
            subHeader: str.fundLinkSubHeader(),
            body: str.fundLinkBody(context)
          }
        },
        artifacts: {
          ...textLine("fundLink", undefined, true)
        }
      }
    }),
    navigateToSafe: () => push('#/safe/transactions')
  },
  services: {
    connectSafeService: connectSafeService,
    createPrivateKeyService: createPrivateKeyService,
    deploySafeService: deploySafeService,
    fundSafeService: fundSafeService,
    hubSignupService: hubSignupService
  }
});
*/
import {ProcessDefinition} from "../../../../libs/o-processes/processManifest";

export const initializeApp: ProcessDefinition = {
  name: "initializeApp",
  stateMachine: undefined
};
