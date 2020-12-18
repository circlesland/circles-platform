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
import {setDappState, tryGetDappState} from "../../libs/o-os/loader";
import {config} from "../../libs/o-circles-protocol/config";
import {BN} from "ethereumjs-util";
import {sendInviteCredits, SendInviteCreditsContext} from "./processes/omo/sendInviteCredits";
import {deploySafe} from "./processes/safe/deploySafe";
import {Token} from "../../libs/o-fission/entities/token";
import {KeyPair} from "../../libs/o-fission/entities/keyPair";
import {Address} from "../../libs/o-circles-protocol/interfaces/address";
import {FissionAuthState} from "../fissionauth/manifest";
import {BehaviorSubject} from "rxjs";
import {HubAccount} from "../../libs/o-circles-protocol/model/hubAccount";
import {CirclesHub} from "../../libs/o-circles-protocol/circles/circlesHub";
import {EventStore} from "../../libs/o-fission/eventStore";
import {CacheEvent} from "../../libs/o-fission/entities/cacheEvent";

export interface Contact
{
  safeAddress: Address,
  trust: {
    in: number,
    out: number
  }
}

export interface OmoSafeState
{
  mySafeAddress?: Address,
  myKey?: KeyPair,
  myToken?: Token,
  myAccountXDaiBalance?: BN,
  mySafeXDaiBalance?: BN,
  myContacts?: BehaviorSubject<Contact[]>
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

async function tryInitMyToken()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const myToken = await fissionAuthState.fission.tokens.tryGetMyToken();

  setDappState<OmoSafeState>("omo.safe:1", currentState =>
  {
    return {
      ...currentState,
      myToken: myToken
    };
  });
}

async function tryInitMyKey()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const myKey = await fissionAuthState.fission.keys.tryGetMyKey();

  setDappState<OmoSafeState>("omo.safe:1", currentState =>
  {
    return {
      ...currentState,
      myKey: myKey
    };
  });
}

async function tryInitXDaiBalances()
{
  const web3 = config.getCurrent().web3();
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const balances: {
    accountXDaiBalance?: BN,
    safeXDaiBalance?: BN
  } = {};

  if (safeState.myKey)
  {
    const ownerAddress = web3
      .eth
      .accounts
      .privateKeyToAccount(safeState.myKey.privateKey)
      .address;

    balances.accountXDaiBalance = new BN(await web3.eth.getBalance(ownerAddress));
  }

  if (safeState.mySafeAddress)
  {
    balances.safeXDaiBalance = new BN(await web3.eth.getBalance(safeState.mySafeAddress));
  }

  setDappState<OmoSafeState>("omo.safe:1", (current) => {
    return {
      ...current,
      mySafeXDaiBalance: balances.safeXDaiBalance,
      myAccountXDaiBalance: balances.accountXDaiBalance
    }
  });
}

async function tryInitMyContacts()
{
  const incomingTrustsName = "Trust_In";
  const outgoingTrustsName = "Trust_Out";

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  // Look for cached trust events
  const fromBlockNo = safeState.myToken?.createdInBlockNo ?? config.getCurrent().HUB_BLOCK;

  const myContacts:{
    [safeAddress:string]: Contact
  } = {}

  const myContactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  let lastCachedBlock: number = fromBlockNo;

  function aggregateContacts(trustEvent:CacheEvent)
  {
    const {canSendTo, user, limit} = JSON.parse(trustEvent.data);

    const otherSafeAddress = user == safeState.mySafeAddress
      ? canSendTo
      : user;

    const contact = myContacts[otherSafeAddress]
      ?? <Contact>{
        safeAddress: otherSafeAddress,
        trust: {}
      };

    // If I can send circles to someone, then this person trusts me -> 'in'
    contact.trust.in = user == safeState.mySafeAddress
      ? limit
      : contact.trust.in;

    // If someone can send circles to me, then I trust that person -> 'out'
    contact.trust.out = canSendTo == safeState.mySafeAddress
      ? limit
      : contact.trust.out;

    myContacts[otherSafeAddress] = contact;

    lastCachedBlock = lastCachedBlock < trustEvent.blockNo
      ? trustEvent.blockNo
      : lastCachedBlock;
  }

  // Go trough all cached trust events (must be ordered from old to new - ASC)
  // and keep only the latest trust values per connection.
  // Keep also track of the latest cached block number.
  const fromDayIdx = Math.floor(fromBlockNo / EventStore.blocksPerDay);
  const cachedTrustEvents = (await fissionAuthState.fission.events.loadEventsFromFs(incomingTrustsName, fromDayIdx))
    .concat(await fissionAuthState.fission.events.loadEventsFromFs(outgoingTrustsName, fromDayIdx));
  cachedTrustEvents.forEach(aggregateContacts);
  myContactsSubject.next(Object.values(myContacts));

  //
  // Connect the event source
  //
  const cfg = config.getCurrent();
  const web3 = config.getCurrent().web3();
  const hub = new CirclesHub(web3, cfg.HUB_ADDRESS);

  //
  // Query all new trust connections and monitor the events
  //
  const myIncomingTrusts = hub.queryEvents(CirclesHub.queryPastTrusts(
    null,
    safeState.mySafeAddress,
    lastCachedBlock));

  let lastEventTimestamp = undefined;
  let flushDelayTimeInMs = 20 * 1000;
  let flushing = false;

  const incomingTrustEvents = await fissionAuthState.fission.events.attachEventSource(incomingTrustsName, myIncomingTrusts);
  incomingTrustEvents.subscribe(trustEvent => {
    console.log("New trust event:", trustEvent);
    aggregateContacts({
      blockNo: trustEvent.blockNumber.toNumber(),
      data: JSON.stringify(trustEvent.returnValues),
      source: incomingTrustsName,
      eventType: trustEvent.event,
      blockHash: trustEvent.blockHash,
      senderType: "contract",
      senderRef: trustEvent.address
    });

    lastEventTimestamp = Date.now();
    myContactsSubject.next(Object.values(myContacts));
  });

  const myOutgoingTrusts = hub.queryEvents(CirclesHub.queryPastTrusts(
    safeState.mySafeAddress,
    null,
    lastCachedBlock));

  const outgoingTrustEvents = await fissionAuthState.fission.events.attachEventSource(outgoingTrustsName, myOutgoingTrusts);
  outgoingTrustEvents.subscribe(trustEvent => {
    console.log("New trust event:", trustEvent);
    aggregateContacts({
      blockNo: trustEvent.blockNumber.toNumber(),
      data: JSON.stringify(trustEvent.returnValues),
      source: incomingTrustsName,
      eventType: trustEvent.event,
      blockHash: trustEvent.blockHash,
      senderType: "contract",
      senderRef: trustEvent.address
    });

    lastEventTimestamp = Date.now();
    myContactsSubject.next(Object.values(myContacts));
  });

  setInterval(async () =>
  {
    if (flushing)
    {
      return;
    }
    if (lastEventTimestamp > Date.now() - flushDelayTimeInMs)
    {
      return;
    }

    flushing = true;

    console.log("Flushing events to fission ..")
    await fissionAuthState.fission.events.flush();
    fissionAuthState.fission.events.clearBuffer();
    console.log("Flushed events to fission.")

    flushing = false;
  }, 1000);

  setDappState<OmoSafeState>("omo.safe:1", existing => {
    return {
      ...existing,
      myContacts: myContactsSubject
    }
  });
}

/**
 * Checks if the omosapien has a private  key in its storage.
 * If the user doesn't have a private key, he's prompted to either
 * import one or to create a new one.
 * @param stack
 * @param runtimeDapp
 */
async function initialize(stack, runtimeDapp: RuntimeDapp<any, any>)
{
  await tryInitMyKey();
  await tryInitMyToken();
  await tryInitXDaiBalances();
  await tryInitMyContacts();

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
