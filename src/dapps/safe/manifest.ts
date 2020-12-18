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
import {Token as TokenEntity} from "../../libs/o-fission/entities/token";
import {KeyPair} from "../../libs/o-fission/entities/keyPair";
import {Address} from "../../libs/o-circles-protocol/interfaces/address";
import {FissionAuthState} from "../fissionauth/manifest";
import {BehaviorSubject} from "rxjs";
import {Event} from "../../libs/o-circles-protocol/interfaces/event";
import {CirclesHub} from "../../libs/o-circles-protocol/circles/circlesHub";
import {EventStore} from "../../libs/o-fission/eventStore";
import {CacheEvent} from "../../libs/o-fission/entities/cacheEvent";
import {HubAccount} from "../../libs/o-circles-protocol/model/hubAccount";
import {Erc20Token} from "../../libs/o-circles-protocol/token/erc20Token";
import {fundAccountForSafeCreation} from "./processes/omo/fundAccountForSafeCreation";

export interface Contact
{
  safeAddress: Address,
  trust: {
    in: number,
    out: number
  }
}

export interface Token
{
  createdInBlockNo: number,
  ownerSafeAddress: Address,
  tokenAddress: Address,
  balance: BN
}

export interface CirclesTransaction
{
  blockNo: number,
  key: string,
  timestamp: Date,
  direction: "in"|"out",
  subject: string,
  from: Address,
  to: Address,
  amount: BN,
}

export interface OmoSafeState
{
  mySafeAddress?: Address,
  myKey?: KeyPair,
  myToken?: Token,
  myAccountXDaiBalance?: BN,
  mySafeXDaiBalance?: BN,
  myContacts?: BehaviorSubject<Contact[]>,
  myKnownTokens?: BehaviorSubject<{[safeAddress:string]:Token}>,
  myTransactions?: BehaviorSubject<CirclesTransaction[]>,
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
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let myToken = await fissionAuthState.fission.tokens.tryGetMyToken();

  if (!myToken)
  {
    const cfg = config.getCurrent();
    const web3 = config.getCurrent().web3();
    const hub = new CirclesHub(web3, cfg.HUB_ADDRESS);

    const mySignupEvents = hub.queryEvents(CirclesHub.queryPastSignup(safeState.mySafeAddress));
    const mySignupArr = await mySignupEvents.toArray();
    const mySignup = mySignupArr[0];

    if (mySignup)
    {
      myToken = {
        name: "me",
        tokenAddress: mySignup.returnValues.token,
        circlesAddress: mySignup.returnValues.user,
        createdInBlockNo: mySignup.blockNumber.toNumber()
      }
    }
  }

  setDappState<OmoSafeState>("omo.safe:1", currentState =>
  {
    return {
      ...currentState,
      myToken: myToken
    };
  });
}

async function tryInitSafeAddress()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const myProfile = await fissionAuthState.fission.profiles.tryGetMyProfile();

  if (myProfile?.circlesAddress)
  {
    setDappState<OmoSafeState>("omo.safe:1", currentState =>
    {
      return {
        ...currentState,
        mySafeAddress: myProfile.circlesAddress
      };
    });
  }
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


async function tryInitMyKnownTokens()
{
  const myKnownTokensSubject: BehaviorSubject<{[safeAddress:string]:Token}> = new BehaviorSubject<{[safeAddress:string]:Token}>({});
  const knownTokens:{[safeAddress:string]:Token} = {};

  const cfg = config.getCurrent();
  const web3 = config.getCurrent().web3();
  const hub = new CirclesHub(web3, cfg.HUB_ADDRESS);

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  // Load the known tokens from the fission cache
  const allTokens = await fissionAuthState.fission.tokens.listItems();
  allTokens.forEach(cachedToken => {
    knownTokens[cachedToken.circlesAddress] = {
      createdInBlockNo: cachedToken.createdInBlockNo,
      tokenAddress: cachedToken.tokenAddress,
      ownerSafeAddress: cachedToken.circlesAddress,
      balance: new BN("0")
    };
  });
  myKnownTokensSubject.next(knownTokens);

  // Update the token list whenever the contact list changes
  safeState.myContacts.subscribe(async contactList =>
  {
    // Only contacts for which we don't have the token already are relevant
    const newContacts = contactList.filter(contact => !knownTokens[contact.safeAddress]);

    const newContactsSignupEvents = hub.queryEvents(CirclesHub.queryPastSignups(newContacts.map(o => o.safeAddress)));
    const newContactsSignupArr = await newContactsSignupEvents.toArray();

    const addedTokens = await Promise.all(newContactsSignupArr.map(async signupEvent => {
      knownTokens[signupEvent.returnValues.user] = {
        tokenAddress: signupEvent.returnValues.token,
        createdInBlockNo: signupEvent.blockNumber.toNumber(),
        ownerSafeAddress: signupEvent.returnValues.user,
        balance: new BN("0")
      };

      await fissionAuthState.fission.tokens.addOrUpdate({
        name: signupEvent.returnValues.user,
        tokenAddress: signupEvent.returnValues.token,
        circlesAddress: signupEvent.returnValues.user,
        createdInBlockNo: signupEvent.blockNumber.toNumber()
      }, false);

      return 0;
    }));

    if (addedTokens.length > 0)
    {
      await fissionAuthState.fission.tokens.publish();
    }

    myKnownTokensSubject.next(knownTokens);
  });

  setDappState<OmoSafeState>("omo.safe:1", existing => {
    return {
      ...existing,
      myKnownTokens: myKnownTokensSubject
    }
  });
}

async function tryInitMyTransactions()
{
  const myTransactionsSubject: BehaviorSubject<CirclesTransaction[]> = new BehaviorSubject<CirclesTransaction[]>([]);

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const cfg = config.getCurrent();
  const web3 = cfg.web3();
  const hubAddress = cfg.HUB_ADDRESS;
  const circlesHub = new CirclesHub(web3, hubAddress);

  const incomingTransactionsName = "Transactions_In";
  const outgoingTransactionsName = "Transactions_Out";

  const fromBlockNo = safeState.myToken?.createdInBlockNo ?? config.getCurrent().HUB_BLOCK;
  let lastCachedBlock: number = fromBlockNo;

  //
  // First, try to feed-in all cached transactions
  //
  const fromDayIdx = Math.floor(fromBlockNo / EventStore.blocksPerDay);
  const cachedTransactions = (await fissionAuthState.fission.events.loadEventsFromFs(incomingTransactionsName, fromDayIdx))
    .concat(await fissionAuthState.fission.events.loadEventsFromFs(outgoingTransactionsName, fromDayIdx));

  function mapTransactionEvent(transactionEvent:CacheEvent|Event)
  {
    if ((<Event>transactionEvent).returnValues)
    {
      const ev = <Event>transactionEvent;
      return <CirclesTransaction>{
        direction: ev.returnValues.from == safeState.mySafeAddress ? "out" : "in",
        from: ev.returnValues.from,
        to: ev.returnValues.to,
        amount: new BN(ev.returnValues.value),
        subject: "",
        timestamp: new Date(),
        blockNo: ev.blockNumber.toNumber()
      };
    }
    else
    {
      const ev = <CacheEvent>transactionEvent;
      return <CirclesTransaction>{
        direction: ev.senderRef == safeState.mySafeAddress ? "out" : "in",
        from: ev.senderRef,
        to: ev.recipientRef,
        amount: new BN(ev.valueInWei),
        subject: ev.data,
        timestamp: new Date(),
        blockNo: ev.blockNo
      };
    }
  }

  const cachedCirclesTransactions = cachedTransactions.map(transactionEvent =>
  {
    lastCachedBlock = lastCachedBlock < transactionEvent.blockNo
      ? transactionEvent.blockNo
      : lastCachedBlock;

    return mapTransactionEvent(transactionEvent);
  });
  myTransactionsSubject.next(cachedCirclesTransactions);

  //
  // Then query all transactions after the last cached block
  //
  let inSubscriptions = [];
  let outSubscriptions = [];

  safeState.myKnownTokens.subscribe(async tokenList =>
  {
    // If there are already subscriptions, cancel them first
    outSubscriptions.concat(inSubscriptions).forEach(sub => sub.unsubscribe());
    inSubscriptions = [];
    outSubscriptions = [];

    const tokens = Object.values(tokenList);
    const allTokenInEventObservables = await Promise.all(tokens.map(async token =>
    {
      const erc20Contract = new Erc20Token(web3, token.tokenAddress);
      const inTransactionsQuery = Erc20Token.queryPastTransfers(
        undefined,
        safeState.mySafeAddress,
        token.createdInBlockNo > lastCachedBlock
          ? token.createdInBlockNo
          : lastCachedBlock);
      const inTranactionEventQuery = erc20Contract.queryEvents(inTransactionsQuery);
      const inTransactionEvents = await fissionAuthState.fission.events.attachEventSource(`${incomingTransactionsName}_${token.tokenAddress}`, inTranactionEventQuery);
      return inTransactionEvents;
    }));

    // Go trough all known tokens and subscribe to the in-transfer events
    inSubscriptions = allTokenInEventObservables.map(o =>
    {
      return o.subscribe(erc20TransferEvent =>
      {
        const transaction = mapTransactionEvent(erc20TransferEvent);
        console.log("New incoming transaction:", transaction);
        cachedCirclesTransactions.push(transaction);
        myTransactionsSubject.next(cachedCirclesTransactions);
      });
    });

    const allTokenOutEventObservables = await Promise.all(tokens.map(async token =>
    {
      const erc20Contract = new Erc20Token(web3, token.tokenAddress);
      const outTransactionsQuery = Erc20Token.queryPastTransfers(
        safeState.mySafeAddress,
        undefined,
        token.createdInBlockNo > lastCachedBlock
          ? token.createdInBlockNo
          : lastCachedBlock);
      const outTransactionEventQuery = erc20Contract.queryEvents(outTransactionsQuery);
      const outTransactionEvents = await fissionAuthState.fission.events.attachEventSource(`${outgoingTransactionsName}_${token.tokenAddress}`, outTransactionEventQuery);
      return outTransactionEvents;
    }));

    // Go trough all known tokens and subscribe to the in-transfer events
    outSubscriptions = allTokenOutEventObservables.map(o =>
    {
      return o.subscribe(erc20TransferEvent =>
      {
        cachedCirclesTransactions.push(mapTransactionEvent(erc20TransferEvent));
        myTransactionsSubject.next(cachedCirclesTransactions);
      });
    });

    console.log(`subscribed to the in- and out-transfer events of ${outSubscriptions.length} tokens. Transactions:`, cachedCirclesTransactions);
  });

  setDappState<OmoSafeState>("omo.safe:1", existing => {
    return {
      ...existing,
      myTransactions: myTransactionsSubject
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
        trust: {
          in: 0,
          out: 0
        }
      };

    // If I can send circles to someone, then this person trusts me -> 'in'
    contact.trust.in = user == safeState.mySafeAddress
      ? parseInt(limit ?? "0")
      : contact.trust.in;

    // If someone can send circles to me, then I trust that person -> 'out'
    contact.trust.out = canSendTo == safeState.mySafeAddress
      ? parseInt(limit ?? "0")
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

    myContactsSubject.next(Object.values(myContacts));
  });

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
  await tryInitSafeAddress();
  await tryInitMyToken();
  await tryInitXDaiBalances();
  await tryInitMyContacts();
  await tryInitMyKnownTokens();
  await tryInitMyTransactions();


  const status = {
    working: false
  };

  setInterval(async () => {
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
