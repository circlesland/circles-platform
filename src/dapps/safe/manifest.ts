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
  await initMyKey();
  await initSafeAddress();
  await initMyToken();
  await initXDaiBalances();
  await initMyContacts();
  await initMyKnownTokens();
  await initMyTransactions();
  await initMyBalances();

  const status = {
    working: false
  };
  setInterval(async () =>
  {
    if (status.working)
      return;

    status.working = true;
    console.log("Started flushing events ...")

    const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
    await fissionAuthState.fission.events.flush();
    await fissionAuthState.fission.events.clearBuffer();

    status.working = false;
    console.log("Finished flushing events.")
  }, 10000);

  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  if (safeState.mySafeAddress && safeState.myToken)
  {
    // Everything is already set up
    return {
      cancelDependencyLoading: false,
      initialPage: null
    }
  }

  if (safeState.mySafeAddress && !safeState.myToken)
  {
    // Not yet registered at the circles hub
    runtimeDapp.shell.publishEvent(new RunProcess(deploySafe));
    return {
      cancelDependencyLoading: true,
      initialPage: null
    };
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
