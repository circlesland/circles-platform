import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {
  BeginSignal,
  BlockchainEvent,
  DoneSignal,
  SystemEvent
} from "../../../libs/o-circles-protocol/interfaces/blockchainEvent";
import {BN} from "ethereumjs-util";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";
import {OmoSafeState} from "../manifest";
import {CirclesToken} from "../../../libs/o-circles-protocol/model/circlesToken";
import {CirclesTransaction} from "../../../libs/o-circles-protocol/model/circlesTransaction";
import {BlockIndex} from "../../../libs/o-os/blockIndex";
import {config} from "../../../libs/o-circles-protocol/config";
import {FissionAuthState} from "../../fissionauth/manifest";
import {CachedTransactions} from "../../../libs/o-fission/entities/cachedTransactions";

function mapTransactionEvent(token:CirclesToken, transactionEvent: BlockchainEvent)
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  return <CirclesTransaction>{
    token: token.tokenAddress,
    tokenOwner: token.tokenOwner,
    direction: transactionEvent.returnValues.from == safeState.mySafeAddress ? "out" : "in",
    from: transactionEvent.returnValues.from,
    to: transactionEvent.returnValues.to,
    amount: new BN(transactionEvent.returnValues.value),
    subject: "",
    blockNo: transactionEvent.blockNumber.toNumber()
  };
}

type TransactionList = {
  [token:string]: {
    [id:string]:CirclesTransaction
  }
}

const myTransactionsSubject: BehaviorSubject<CirclesTransaction[]> = new BehaviorSubject<CirclesTransaction[]>([]);
const blockIndex = new BlockIndex();
const myTransactions: TransactionList = {};
const tokenSubscriptions: {[tokenAddress:string]:Subscription} = {};

const updateCacheTrigger = new DelayedTrigger(5000, async () =>
{
  const allTransactions = Object.values(myTransactions)
  .map(transactionsById => Object.values(transactionsById))
  .reduce((p,c) => p.concat(c), []);

  allTransactions.sort((a,b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);

  const transactionBlocks: CachedTransactions = {
    name: "transactions",
    entries: {}
  };

  for(let transactionIndex = 0; transactionIndex < allTransactions.length; transactionIndex++)
  {
    const transaction = allTransactions[transactionIndex];

    const serializableTransaction = {
      ...transaction,
      amount: transaction.amount.toString()
    };
    if (!transactionBlocks[transaction.blockNo])
    {
      transactionBlocks[transaction.blockNo] = {
        timestamp: transaction.timestamp,
        transactions: [serializableTransaction]
      };
    }
    else
    {
      transactionBlocks[transaction.blockNo].transactions.push(serializableTransaction);
    }
  }

  console.log("Writing transactions to fission cache ...");

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  await fissionAuthState.fission.transactions.addOrUpdate(transactionBlocks);
  const currentBlock = await config.getCurrent().web3().eth.getBlockNumber();

  // Go trough all tokens and find the first block that contains a transactions
  await Promise.all(Object.keys(tokenSubscriptions).map(async tokenAddress =>
  {
    const firstBlockWithEvents = Object.values(myTransactions[tokenAddress] ?? {})
      .reduce((p,c) => c.blockNo < p ? c.blockNo : p, Number.MIN_SAFE_INTEGER);

    if (firstBlockWithEvents == Number.MIN_SAFE_INTEGER)
    {
      // No events till now
      const token = await fissionAuthState.fission.tokens.tryGetByName(tokenAddress);
      token.noTransactionsUntilBlockNo = currentBlock;
      await fissionAuthState.fission.tokens.addOrUpdate(token, false);
    }
  }));

  await fissionAuthState.fission.tokens.publish();

  console.log("Wrote transactions to fission cache.");
});

const annotateTimeAndStoreToCacheTrigger = new DelayedTrigger(5000, async () =>
{
  const web3 = config.getCurrent().web3();

  let avgBlockTime:number = 5;
  let lastTimestamp:number = null;
  let lastTimestampBlockNo:number = null;

  let allTransactions = Object.values(myTransactions)
    .map(transactionsById => Object.values(transactionsById))
    .reduce((p,c) => p.concat(c), []);

  allTransactions.sort((a,b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
  console.log("Determining time for " + allTransactions.length + " transactions:", allTransactions);

  for(let transactionIndex = 0; transactionIndex < allTransactions.length; transactionIndex++)
  {
    const transaction = allTransactions[transactionIndex];

    try
    {
      if (!lastTimestamp || transactionIndex % 50 == 0)
      {
        if (transaction.timestamp)
        {
          lastTimestamp = transaction.timestamp;
          lastTimestampBlockNo = transaction.blockNo;
        }
        else
        {
          const block = await web3.eth.getBlock(transaction.blockNo);
          lastTimestamp = block.timestamp;
          lastTimestampBlockNo = transaction.blockNo;
        }
      }

      const passedBlocksSinceLastTimestampBlockNo = lastTimestampBlockNo - transaction.blockNo;
      const passedSecondsSinceLastTimestamp = passedBlocksSinceLastTimestampBlockNo * avgBlockTime;
      const currentBlockTimestamp = lastTimestamp - passedSecondsSinceLastTimestamp;

      if (!transaction.cached || !transaction.timestamp)
      {
        transaction.timestamp = currentBlockTimestamp;
      }
    }
    catch (e)
    {
      console.warn("Couldn't determine the time of block " + transaction.blockNo + ": " + e.toString());
    }
  }

  allTransactions = Object.values(myTransactions)
    .map(transactionsById => Object.values(transactionsById))
    .reduce((p,c) => p.concat(c), []);

  allTransactions.sort((a,b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
  myTransactionsSubject.next(allTransactions);
  updateCacheTrigger.trigger();
});

const updateTrigger = new DelayedTrigger(30, async () =>
{
  const allTransactions = Object.values(myTransactions)
    .map(transactionsById => Object.values(transactionsById))
    .reduce((p,c) => p.concat(c), []);

  allTransactions.sort((a,b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
  myTransactionsSubject.next(allTransactions);

  if (allTransactions.filter(o => !o.timestamp).length > 0)
  {
    annotateTimeAndStoreToCacheTrigger.trigger();
  }
});

function indexTransaction(token:CirclesToken, transactionEvent?:BlockchainEvent, ct?:CirclesTransaction)
{
  if (transactionEvent)
  {
    blockIndex.addBlock(transactionEvent.blockNumber.toNumber());
    const circlesTransaction = mapTransactionEvent(token, transactionEvent);
    const transactionId = getTransactionId(circlesTransaction);

    if(myTransactions[token.tokenAddress]
      && myTransactions[token.tokenAddress][transactionId]
      && myTransactions[token.tokenAddress][transactionId].cached)
    {
      return;
    }

    const transactionsById = myTransactions[token.tokenAddress] ?? {};
    transactionsById[transactionId] = circlesTransaction;
    myTransactions[token.tokenAddress] = transactionsById;
  }
  else if (ct)
  {
    try
    {
      ct.amount = new BN(ct.amount);
    } catch {}

    ct.cached = true;
    blockIndex.addBlock(ct.blockNo);
    const transactionsById = myTransactions[token.tokenAddress] ?? {};
    transactionsById[getTransactionId(ct)] = ct;
    myTransactions[token.tokenAddress] = transactionsById;
  }
}

function getTransactionId(transaction:CirclesTransaction):string
{
  return `${transaction.blockNo}_${transaction.token}_${transaction.from}_${transaction.to}_${transaction.amount.toString()}`;
}

async function feedCachedTransactions()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");

  const cachedTransactions = await fissionAuthState.fission.transactions.tryGetByName("transactions");
  if (!cachedTransactions)
  {
    return;
  }

  const knownTokens = safeState.myKnownTokens.getValue();
  const latestBlocks:{
    [tokenAddress:string]:number
  } = {};

  // Feed-in all transactions
  Object.values(cachedTransactions).forEach((blockEntry:{transactions:CirclesTransaction[]}) =>
  {
    if (!blockEntry.transactions)
    {
      return;
    }

    blockEntry.transactions.forEach(transaction =>
    {
      const token = knownTokens[transaction.tokenOwner];
      if (!token)
      {
        return;
      }

      if (!latestBlocks[token.tokenAddress] || latestBlocks[token.tokenAddress] < transaction.blockNo)
      {
        latestBlocks[token.tokenAddress] = transaction.blockNo;
      }

      indexTransaction(token, undefined, transaction);
    });

    updateTrigger.trigger();
  });

  // Subscribe to the events of all cached tokens
  Object.values(knownTokens).forEach(token =>
  {
    if (tokenSubscriptions[token.tokenAddress])
    {
      return;
    }

    const fromBlock = latestBlocks[token.tokenAddress] ?? token.noTransactionsUntilBlockNo ?? token.createdInBlockNo;
    const tokenTransactionsSubject = subscribeToTokenTransactions(token, fromBlock);
    tokenTransactionsSubject.next(new BeginSignal(token.tokenAddress));
  });
}

function subscribeToTokenTransactions(newToken:CirclesToken, fromBlock?:number) : Subject<SystemEvent>
{
  if (tokenSubscriptions[newToken.tokenAddress])
  {
    return;
  }
  console.log("Subscribing to transaction history of token '" + newToken.tokenAddress + "' from block no. " + (fromBlock ?? 0) + ".");

  const tokenTransactions = newToken.subscribeToTransactions(fromBlock);
  tokenSubscriptions[newToken.tokenAddress] = tokenTransactions.subscribe(inTransactionEvent =>
  {
    if (inTransactionEvent instanceof BeginSignal)
    {
      console.log("Start loading the complete transaction history of token " + inTransactionEvent.key);
    }
    else if (inTransactionEvent instanceof DoneSignal)
    {
      console.log("Finished loading of the complete transaction history of token " + inTransactionEvent.key);
    }
    else
    {
      indexTransaction(newToken, <BlockchainEvent>inTransactionEvent, undefined);
    }
    updateTrigger.trigger();
  });

  return tokenTransactions;
}

export async function initMyTransactions()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  await feedCachedTransactions();

  safeState.myKnownTokens.subscribe(async tokenList =>
  {
    const newTokens = Object.values(tokenList).filter(o => !tokenSubscriptions[o.tokenAddress]);
    if (newTokens.length == 0)
    {
      return;
    }

    newTokens.forEach(newToken =>
    {
      subscribeToTokenTransactions(newToken, newToken.noTransactionsUntilBlockNo);
    });
  });

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myTransactions: myTransactionsSubject
    }
  });
}
