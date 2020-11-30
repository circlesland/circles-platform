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
import {createAccount} from "webnative/lobby";
import {createAccountService} from "./services/createAccountService";

export interface CreateSafeContext extends ProcessContext {
  data: {
    account?: ProcessArtifact,
    safeAddress?: ProcessArtifact,
    fundLink?:ProcessArtifact
  }
}

/**
 * Connect safe
 */
const str = strings.safe.processes.createSafe;
const processDefinition = () => createMachine<CreateSafeContext, OmoEvent>({
  initial: "checkAccount",
  states: {
    checkAccount: {
      entry: send({
        type: "process.continue"
      }),
      on: {
        "process.continue": [{
          target: "createAccount",
          cond: (contexts) => !contexts.environment.account.address
        }, {
          target: "checkFunding",
          cond: (contexts) => !!contexts.environment.account.address
        }]
      }
    },
    createAccount: {
      entry: sendInProgressPrompt(str.titleInitializing),
      invoke: {
        id: 'createAccount',
        src: createAccountService,
        onError: {
          actions: setError,
          target: "error"
        },
        onDone: {
          actions: setResult(str.successCreateSafe),
          target: "checkFunding"
        }
      }
    },
    checkFunding: {
      entry: send({
        type: "process.continue"
      }),
      on: {
        "process.continue": [{
          cond: (context) => context.environment.accountxDaiBalance.gte(new BN("1234")),
          target: "checkSafe"
        },{
          cond: (context) => context.environment.accountxDaiBalance.lt(new BN("1234")),
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
          cond: (context) => !context.environment.safe,
          target: "deploySafe"
        },{
          cond: (context) => !!context.environment.safe,
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

export const createSafe: ProcessDefinition = {
  name: "createSafe",
  stateMachine: processDefinition
};
