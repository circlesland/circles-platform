import AnswerInviteRequest from "./views/pages/AnswerInviteRequest.svelte"
import Transactions from "./views/pages/Transactions.svelte"
import Friends from "./views/pages/Friends.svelte"
import Tokens from "./views/pages/Tokens.svelte"
import {safeDefaultActions, safeOverflowActions} from "./data/actions"
import {QuickAction} from "../../libs/o-os/types/quickAction";
import {RunProcess} from "../../libs/o-events/runProcess";
import {faCheck, faPiggyBank, faTimes} from "@fortawesome/free-solid-svg-icons";
import {ProcessArtifact} from "../../libs/o-processes/interfaces/processArtifact";
import {CloseModal} from "../../libs/o-events/closeModal";
import {push} from "svelte-spa-router";
import {DappManifest} from "../../libs/o-os/interfaces/dappManifest";
import {RuntimeDapp} from "../../libs/o-os/interfaces/runtimeDapp";
import {tryGetDappState} from "../../libs/o-os/loader";
import {BN} from "ethereumjs-util";
import {sendInviteCredits, SendInviteCreditsContext} from "./processes/omo/sendInviteCredits";
import {deploySafe} from "./processes/safe/deploySafe";
import {KeyPair} from "../../libs/o-fission/entities/keyPair";
import {Address} from "../../libs/o-circles-protocol/interfaces/address";
import {FissionAuthState} from "../fissionauth/manifest";
import {BehaviorSubject} from "rxjs";
import {initMyKey} from "./init/myKey";
import {initXDaiBalances} from "./init/xDaiBalances";
import {initMyContacts} from "./init/myContacts";
import {initMyKnownTokens} from "./init/myKnownTokens";
import {initMyTransactions} from "./init/myTransactions";
import {initSafeAddress} from "./init/safeAddress";
import {initMyToken} from "./init/myToken";
import {CirclesToken} from "../../libs/o-circles-protocol/model/circlesToken";
import {Contact} from "../../libs/o-circles-protocol/model/contact";
import {CirclesTransaction} from "../../libs/o-circles-protocol/model/circlesTransaction";
import {CirclesBalance} from "../../libs/o-circles-protocol/model/circlesBalance";
import {initMyBalances} from "./init/myBalances";
import {initialMenu} from "./processes/menus/initialMenu";
import {fundAccountForSafeCreation} from "./processes/omo/fundAccountForSafeCreation";
import {signupAtCircles} from "./processes/omo/signupAtCircles";
import {BeginSignal, ProgressSignal} from "../../libs/o-circles-protocol/interfaces/blockchainEvent";

export interface OmoSafeState
{
  mySafeAddress?: Address,
  myKey?: KeyPair,
  myToken?: CirclesToken,
  myAccountXDaiBalance?: BN,
  mySafeXDaiBalance?: BN,
  myContacts?: BehaviorSubject<Contact[]>,
  myKnownTokens?: BehaviorSubject<{ [safeAddress: string]: CirclesToken }>,
  myTransactions?: BehaviorSubject<CirclesTransaction[]>,
  myBalances?: BehaviorSubject<CirclesBalance[]>
}

const transactionPage = {
  isDefault: true,
  routeParts: ["transactions"],
  component: Transactions,
  available: [
    (detail) =>
    {
      console.log("routeGuard.detail:", detail);
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


/**
 * Checks if the omosapien has a private  key in its storage.
 * If the user doesn't have a private key, he's prompted to either
 * import one or to create a new one.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack, runtimeDapp: RuntimeDapp<any, any>)
{
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
      initialPage: null,
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
      initialPage: null,
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
      initialPage: null,
      dappState: null
    };
  }

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your token ..", 0));
  await initMyToken();

  safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  if (safeState.mySafeAddress && !safeState.myToken)
  {
    // Not yet registered at the circles hub
    runtimeDapp.shell.publishEvent(new RunProcess(signupAtCircles));
    return {
      cancelDependencyLoading: true,
      initialPage: null
    };
  }

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your contacts ..", 0));
  await initMyContacts();
  await initMyKnownTokens();

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your transactions ..", 0));
  await initMyTransactions();

  window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your balances ..", 0));
  await initMyBalances();

  if (safeState.mySafeAddress && safeState.myToken)
  {
    // Everything is already set up
    return {
      cancelDependencyLoading: false,
      initialPage: null
    }
  }

  return {
    cancelDependencyLoading: true,
    initialPage: null,
    dappState: null
  };
}

export const omosafe: DappManifest<OmoSafeState, OmoSafeState> = {
  id: "omo.safe:1",
  dependencies: ["omo.sapien:1"],
  icon: faPiggyBank,
  title: "OmoSafe",
  routeParts: ["safe"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: initialize,
  pages: [{
    routeParts: ["empowerMe", ":from"],
    component: AnswerInviteRequest,
    available: [
      (detail) =>
      {
        console.log("Starting answer invite process ..", detail);
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
          console.log("routeGuard.detail:", detail);
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
          console.log("routeGuard.detail:", detail);
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
