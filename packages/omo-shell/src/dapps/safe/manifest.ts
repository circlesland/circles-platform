import AnswerInviteRequest from "./views/pages/AnswerInviteRequest.svelte"
import Transactions from "./views/pages/Transactions.svelte"
import Friends from "./views/pages/Friends.svelte"
import Tokens from "./views/pages/Tokens.svelte"
import NoFundsOnAccount from "./views/pages/NoFundsOnAccount.svelte"
import NoKey from "./views/pages/NoKey.svelte"
import NoSafe from "./views/pages/NoSafe.svelte"
import NoToken from "./views/pages/NoToken.svelte"
import NoFundsOnSafe from "./views/pages/NoFundsOnSafe.svelte"
import {safeDefaultActions, safeOverflowActions} from "./data/actions"
import {faCheck, faPiggyBank, faTimes} from "@fortawesome/free-solid-svg-icons";
import {push} from "svelte-spa-router";
import {tryGetDappState} from "../../libs/o-os/loader";
import {BN} from "ethereumjs-util";
import {sendInviteCredits, SendInviteCreditsContext} from "./processes/omo/sendInviteCredits";
import {deploySafe} from "./processes/safe/deploySafe";
import {FissionAuthState} from "../fissionauth/manifest";
import {BehaviorSubject} from "rxjs";
import {initMyKey} from "./init/myKey";
import {initXDaiBalances} from "./init/xDaiBalances";
import {initMyContacts} from "./init/myContacts";
import {initMyKnownTokens} from "./init/myKnownTokens";
import {initMyTransactions} from "./init/myTransactions";
import {initSafeAddress} from "./init/safeAddress";
import {initMyToken} from "./init/myToken";
import {initMyBalances} from "./init/myBalances";
import {initialMenu} from "./processes/menus/initialMenu";
import {fundAccountForSafeCreation} from "./processes/omo/fundAccountForSafeCreation";
import {signupAtCircles} from "./processes/omo/signupAtCircles";
import {Logger} from "omo-utils/dist/logger";
import {fundSafe} from "./processes/omo/fundSafe";
import {KeyPair} from "omo-models/dist/omo/keyPair";
import {CirclesToken} from "omo-circles/dist/model/circlesToken";
import {Envelope} from "omo-kernel-interfaces/dist/envelope";
import {Contact} from "omo-models/dist/omo/contact";
import {CirclesTransaction} from "omo-models/dist/circles/circlesTransaction";
import {CirclesBalance} from "omo-models/dist/circles/circlesBalance";
import {QuickAction} from "omo-kernel-interfaces/dist/quickAction";
import {RuntimeDapp} from "omo-kernel-interfaces/dist/runtimeDapp";
import {BeginSignal} from "omo-events/dist/beginSignal";
import {ProgressSignal} from "omo-events/dist/progressSignal";
import {RunProcess} from "omo-process/dist/events/runProcess";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {CloseModal} from "omo-events/dist/shell/closeModal";

export interface OmoSafeState
{
  mySafeAddress?: string,
  myKey?: KeyPair,
  myToken?: CirclesToken,
  myAccountXDaiBalance?: BN,
  mySafeXDaiBalance?: BN,
  myContacts?: BehaviorSubject<Envelope<Contact[]>>,
  myKnownTokens?: BehaviorSubject<Envelope<{ [safeAddress: string]: CirclesToken }>>,
  myTransactions?: BehaviorSubject<Envelope<CirclesTransaction[]>>,
  myBalances?: BehaviorSubject<Envelope<CirclesBalance[]>>
}

const transactionPage = {
  isDefault: true,
  routeParts: ["transactions"],
  component: Transactions,
  available: [
    (detail) =>
    {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
};

const noFundsOnAccountPage = {
  isDefault: true,
  routeParts: ["no-funds"],
  component: NoFundsOnAccount,
  available: [
    (detail) =>
    {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
};

const noKeyPage = {
  isDefault: true,
  routeParts: ["no-key"],
  component: NoKey,
  available: [
    (detail) =>
    {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
};

const noSafePage = {
  isDefault: true,
  routeParts: ["no-safe"],
  component: NoSafe,
  available: [
    (detail) =>
    {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
};

const noTokenPage = {
  isDefault: true,
  routeParts: ["no-token"],
  component: NoToken,
  available: [
    (detail) =>
    {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
};

const noFundsOnSafePage = {
  isDefault: true,
  routeParts: ["no-funds-on-safe"],
  component: NoFundsOnSafe,
  available: [
    (detail) =>
    {
      window.o.logger.log("routeGuard.detail:", detail);
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      return fissionAuthState.fission !== undefined
    }
  ],
  userData: {
    showActionBar: true,
    actions: <QuickAction[]>[
      ...safeDefaultActions,
      ...safeOverflowActions
    ]
  }
};

let safeManifestLogger:Logger;

/**
 * Checks if the omosapien has a private  key in its storage.
 * If the user doesn't have a private key, he's prompted to either
 * import one or to create a new one.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack, runtimeDapp: RuntimeDapp<any, any>)
{
  safeManifestLogger = window.o.logger.newLogger(`initialize()`);
  safeManifestLogger.log("begin")
  window.o.publishEvent(new BeginSignal("omo.safe:1:initialize"));
  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your safe key ..", 0));
  await initMyKey();

  let safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  if (!safeState.myKey)
  {
    // Safe not connected
    window.o.publishEvent(new RunProcess(initialMenu));
    return {
      cancelDependencyLoading: true,
      initialPage: noKeyPage,
      dappState: null
    };
  }

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your safe address ..", 0));
  await initSafeAddress();

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your xDai balances ..", 0));
  await initXDaiBalances();

  safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  if (!safeState.mySafeAddress
    && (safeState.myAccountXDaiBalance?.lt(new BN("100000")) ?? true))
  {
    // Got an account but no funding to deploy a safe
    window.o.publishEvent(new RunProcess(fundAccountForSafeCreation));
    return {
      cancelDependencyLoading: true,
      initialPage: noFundsOnAccountPage,
      dappState: null
    };
  }
  if (!safeState.mySafeAddress
    && (safeState.myAccountXDaiBalance?.gte(new BN("100000")) ?? false))
  {
    // Got a funded account, ready to deploy the safe
    window.o.publishEvent(new RunProcess(deploySafe));
    return {
      cancelDependencyLoading: true,
      initialPage: noSafePage,
      dappState: null
    };
  }

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your token ..", 0));
  await initMyToken();

  safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  // If the user doesn't have a token and the safe balance is smaller than
  if (safeState.mySafeAddress && !safeState.myToken && safeState.mySafeXDaiBalance?.lte(new BN("4600000000000000")))
  {
    // Not yet registered at the circles hub
    runtimeDapp.shell.publishEvent(new RunProcess(fundSafe));
    return {
      cancelDependencyLoading: true,
      initialPage: noFundsOnSafePage
    };
  }

  if (safeState.mySafeAddress && !safeState.myToken)
  {
    // Not yet registered at the circles hub
    runtimeDapp.shell.publishEvent(new RunProcess(signupAtCircles));
    return {
      cancelDependencyLoading: true,
      initialPage: noTokenPage
    };
  }

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your contacts ..", 0));
  await initMyContacts();

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your contacts' tokens ..", 0));
  await initMyKnownTokens();

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your transactions ..", 0));
  await initMyTransactions(safeManifestLogger);

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your balances ..", 0));
  await initMyBalances();

  safeManifestLogger.log("end")

  return {
    cancelDependencyLoading: false,
    initialPage: transactionPage,
    dappState: null
  };
}

export const omosafe: DappManifest<OmoSafeState, OmoSafeState> = {
  id: "omo.safe:1",
  isSingleton: true,
  dependencies: ["omo.li:1"],
  icon: faPiggyBank,
  title: "OmoSafe",
  routeParts: ["safe"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: initialize,
  pages: [{
    routeParts: ["empowerMe", ":from", ":name"],
    component: AnswerInviteRequest,
    available: [
      (detail) =>
      {
        window.o.logger.log("Starting answer invite process ..", detail);
        return true;
      }
    ],
    userData: {
      showActionBar: true,
      actions: <QuickAction[]>[
        ...safeDefaultActions,
        ...[{
          type: "trigger",
          pos: "overflow",
          mapping: {
            design: {
              icon: faCheck
            },
            data: {
              label: "Jumpstart " + "0x1234..."
            }
          },
          event: () => new RunProcess(sendInviteCredits, async (context: SendInviteCreditsContext) =>
          {
            context.data.recipient = <ProcessArtifact>{
              key: "recipient",
              value: "", // TODO: pre-populate all fields
              isReadonly: true
            };
            return context;
          })
        }, {
          type: "trigger",
          pos: "overflow",
          mapping: {
            design: {
              icon: faTimes
            },
            data: {
              label: "Cancel"
            }
          },
          event: () =>
          {
            push("#/safe/transactions");
            window.o.publishEvent(new CloseModal())
          }
        }]
      ]
    }
  },
    transactionPage,
    {
      routeParts: ["friends"],
      component: Friends,
      available: [
        (detail) =>
        {
          window.o.logger.log("routeGuard.detail:", detail);
          const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
          return fissionAuthState.fission !== undefined
        }
      ],
      userData: {
        showActionBar: true,
        actions: <QuickAction[]>[
          ...safeDefaultActions,
          ...safeOverflowActions
        ]
      }
    }, {
      routeParts: ["tokens"],
      component: Tokens,
      available: [
        (detail) =>
        {
          window.o.logger.log("routeGuard.detail:", detail);
          const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
          return fissionAuthState.fission !== undefined
        }
      ],
      userData: {
        showActionBar: true,
        actions: <QuickAction[]>[
          ...safeDefaultActions,
          ...safeOverflowActions
        ]
      }
    }]
};
