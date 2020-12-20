import {BehaviorSubject, Subscription} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {config} from "../../../libs/o-circles-protocol/config";
import {EventStore} from "../../../libs/o-fission/eventStore";
import {CacheEvent} from "../../../libs/o-fission/entities/cacheEvent";
import {Event} from "../../../libs/o-circles-protocol/interfaces/event";
import {BN} from "ethereumjs-util";
import {Erc20Token} from "../../../libs/o-circles-protocol/token/erc20Token";
import {CirclesTransaction, OmoSafeState, Token} from "../manifest";

function mapTransactionEvent(token:Token, transactionEvent: CacheEvent | Event)
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  if ((<Event>transactionEvent).returnValues)
  {
    const ev = <Event>transactionEvent;
    return <CirclesTransaction>{
      token: token.tokenAddress,
      tokenOwner: token.ownerSafeAddress,
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
    const data = JSON.parse(ev.data);
    return <CirclesTransaction>{
      token: token.tokenAddress,
      tokenOwner: token.ownerSafeAddress,
      direction: data.from == safeState.mySafeAddress ? "out" : "in",
      from: data.from,
      to: data.from,
      amount: new BN(data.value),
      subject: "",
      timestamp: new Date(),
      blockNo: ev.blockNo
    };
  }
}

export async function initMyTransactions()
{
  const myTransactionsSubject: BehaviorSubject<CirclesTransaction[]> = new BehaviorSubject<CirclesTransaction[]>([]);

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const cfg = config.getCurrent();
  const web3 = cfg.web3();

  const incomingTransactionsName = "In";
  const outgoingTransactionsName = "Out";

  const fromBlockNo = safeState.myToken?.createdInBlockNo ?? config.getCurrent().HUB_BLOCK;

  let lastCachedBlock: {[tokenAddress:string]:number} = {};

  let cachedCirclesTransactions: CirclesTransaction[] = []

  //
  // First, try to feed-in all cached transactions
  //
  const tokenList = safeState.myKnownTokens.getValue();
  const fromDayIdx = Math.floor(fromBlockNo / EventStore.pageSize);
  const cachedBlocks:{[blockNo:number]:any} = {};

  const waitForCache = new Promise(async (resolve, reject) =>
  {
    console.log(`initMyTransactions(): Loading cached transactions for tokenList:`, tokenList);

    await Promise.all(Object.values(tokenList).map(async token =>
    {
      console.log(`initMyTransactions(): Loading all cached transfer events for token ${token.tokenAddress} ..`);

      const cachedInTransactions = await fissionAuthState.fission.events.loadEventsFromFs(`${incomingTransactionsName}_${token.tokenAddress}`, fromDayIdx);
      console.log("cachedInTransactions", cachedInTransactions)
      const cachedOutTransactions = await fissionAuthState.fission.events.loadEventsFromFs(`${outgoingTransactionsName}_${token.tokenAddress}`, fromDayIdx);
      console.log("cachedOutTransactions", cachedOutTransactions)

      const cachedTransactions = cachedInTransactions.concat(cachedOutTransactions);

      console.log(`initMyTransactions(): Got ${cachedTransactions.length} cached transfer events for token ${token.tokenAddress}.`);
      cachedTransactions.forEach(transactionEvent =>
      {
        lastCachedBlock[token.tokenAddress] = !lastCachedBlock[token.tokenAddress] || lastCachedBlock[token.tokenAddress] < transactionEvent.blockNo
          ? transactionEvent.blockNo
          : (lastCachedBlock[token.tokenAddress] ?? token.createdInBlockNo);

        cachedBlocks[transactionEvent.blockNo] = true;

        const txEvent = mapTransactionEvent(token, transactionEvent);
        cachedCirclesTransactions.push(txEvent);
      });

      console.log(`initMyTransactions(): Pushed ${cachedTransactions.length} cached transfer events for token ${token.tokenAddress} to the list of known transactions.`);
    }));

    console.log(`initMyTransactions(): Cached transaction loading finished.`);
    cachedCirclesTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
    myTransactionsSubject.next(cachedCirclesTransactions);
    resolve(null);
  });

  console.log("Waiting for cache...");
  await waitForCache;
  console.log("Cache processed.");

  //
  // Then query all transactions after the last cached block
  //
  let inSubscriptions: {
    [safeAddress: string]: {
      token: Token,
      subscription: Subscription
    }
  } = {};
  let outSubscriptions: {
    [safeAddress: string]: {
      token: Token,
      subscription: Subscription
    }
  } = {};

  const mostRecentBlock = await web3.eth.getBlockNumber();
  const fullRanges = Object.values(tokenList).map(token => {
    return {
      token: token,
      from: token.createdInBlockNo,
      to: mostRecentBlock
    }
  });

  const partialRanges = fullRanges.reduce((p,c) =>
  {
    const prs:{token: Token, from:number, to:number}[] = [];
    let lastSegmentBegin = c.from;

    for (let i = c.from; i < c.to; i++)
    {
      if (cachedBlocks[i])
      {
        prs.push({
          token: c.token,
          from: lastSegmentBegin,
          to: i
        });
        lastSegmentBegin = i + 1;
      }
    }

    prs.push({
      token: c.token,
      from: lastSegmentBegin,
      to: c.to
    });

    return p.concat(prs);
  }, []);

  console.log("Partial Ranges: ", partialRanges);

  partialRanges.map(async partialRange =>
  {
    const erc20Contract = new Erc20Token(web3, partialRange.token.tokenAddress);
    const inTransactionsQuery = Erc20Token.queryPastTransfers(
      undefined,
      safeState.mySafeAddress,
      partialRange.from,
      partialRange.to);

    const inTransactionsQ = await erc20Contract.queryEvents(inTransactionsQuery);
    const inTransactions = await inTransactionsQ.toArray();
    inTransactions.forEach(it => {
      const transaction = mapTransactionEvent(partialRange.token, it);
      console.log("New incoming transaction:", transaction);
      cachedCirclesTransactions.push(transaction);
      cachedCirclesTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
      myTransactionsSubject.next(cachedCirclesTransactions);
    });

    const outTransactionsQuery = Erc20Token.queryPastTransfers(
      safeState.mySafeAddress,
      undefined,
      partialRange.from,
      partialRange.to);

    const outTransactionsQ = await erc20Contract.queryEvents(outTransactionsQuery);
    const outTransactions = await outTransactionsQ.toArray();
    outTransactions.forEach(ot => {
      const transaction = mapTransactionEvent(partialRange.token, ot);
      console.log("New outgoing transaction:", transaction);
      cachedCirclesTransactions.push(transaction);
      cachedCirclesTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
      myTransactionsSubject.next(cachedCirclesTransactions);
    });
  });

  safeState.myKnownTokens.subscribe(async tokenList =>
  {
    const tokens = Object.values(tokenList)
      .filter(o => !inSubscriptions[o.ownerSafeAddress] && !outSubscriptions[o.ownerSafeAddress]);

    if (tokens.length == 0)
      return;

    const allTokenInEventObservables = await Promise.all(tokens.map(async token =>
    {
      const erc20Contract = new Erc20Token(web3, token.tokenAddress);
      const inTransactionsQuery = Erc20Token.queryPastTransfers(
        undefined,
        safeState.mySafeAddress,
        lastCachedBlock[token.tokenAddress]);
      const inTransactionEventQuery = erc20Contract.queryEvents(inTransactionsQuery);
      const inTransactionEvents = await fissionAuthState.fission.events.attachEventSource(`${incomingTransactionsName}_${token.tokenAddress}`, inTransactionEventQuery);
      return {
        token: token,
        observable: inTransactionEvents
      };
    }));

    // Go trough all known tokens and subscribe to the in-transfer events
    allTokenInEventObservables.forEach(o =>
    {
      const sub = o.observable.subscribe(erc20TransferEvent =>
      {
        const transaction = mapTransactionEvent(o.token, erc20TransferEvent);
        console.log("New incoming transaction:", transaction);
        cachedCirclesTransactions.push(transaction);
        cachedCirclesTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
        myTransactionsSubject.next(cachedCirclesTransactions);
      });

      inSubscriptions[o.token.ownerSafeAddress] = {
        token: o.token,
        subscription: sub
      };
    });

    const allTokenOutEventObservables = await Promise.all(tokens.map(async token =>
    {
      const erc20Contract = new Erc20Token(web3, token.tokenAddress);
      const outTransactionsQuery = Erc20Token.queryPastTransfers(
        safeState.mySafeAddress,
        undefined,
        lastCachedBlock[token.tokenAddress]);
      const outTransactionEventQuery = erc20Contract.queryEvents(outTransactionsQuery);
      const outTransactionEvents = await fissionAuthState.fission.events.attachEventSource(`${outgoingTransactionsName}_${token.tokenAddress}`, outTransactionEventQuery);
      return {
        token: token,
        observable: outTransactionEvents
      };
    }));

    // Go trough all known tokens and subscribe to the in-transfer events
    allTokenOutEventObservables.forEach(o =>
    {
      const sub = o.observable.subscribe(erc20TransferEvent =>
      {
        const transaction = mapTransactionEvent(o.token, erc20TransferEvent);
        console.log("New out transaction:", transaction);
        cachedCirclesTransactions.push(transaction);
        cachedCirclesTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
        myTransactionsSubject.next(cachedCirclesTransactions);
      });

      outSubscriptions[o.token.ownerSafeAddress] = {
        token: o.token,
        subscription: sub
      };
    });

    console.log(`subscribed to the in- and out-transfer events of ${outSubscriptions.length} tokens. Transactions:`, cachedCirclesTransactions);
  });

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myTransactions: myTransactionsSubject
    }
  });
}
