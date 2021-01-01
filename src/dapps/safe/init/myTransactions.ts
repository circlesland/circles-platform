import {BehaviorSubject, Subject} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {
  BeginSignal,
  DoneSignal,
  SystemEvent
} from "../../../libs/o-circles-protocol/interfaces/blockchainEvent";
import {BN} from "ethereumjs-util";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";
import {OmoSafeState} from "../manifest";
import {CirclesToken} from "../../../libs/o-circles-protocol/model/circlesToken";
import {CirclesTransaction} from "../../../libs/o-circles-protocol/model/circlesTransaction";
import {config} from "../../../libs/o-circles-protocol/config";
import {FissionAuthState} from "../../fissionauth/manifest";
import {CachedTransactions} from "../../../libs/o-fission/entities/cachedTransactions";
import {Address} from "../../../libs/o-circles-protocol/interfaces/address";

type TransactionList = {
  [token: string]: {
    [id: string]: CirclesTransaction
  }
}

// The consumable output of this init step (deduplicated ordered list of transactions)
const myTransactionsSubject: BehaviorSubject<CirclesTransaction[]> = new BehaviorSubject<CirclesTransaction[]>([]);

// In-memory cache of all transactions
const myTransactions: TransactionList = {};

// Contains all known tokens to which we've already subscribed
const tokensByAddress: { [address: string]: CirclesToken } = {};

// All incoming raw transactions are passed trough this stream.
const transactionStream: Subject<CirclesTransaction> = new Subject<CirclesTransaction>();


function indexTransaction(ct: CirclesTransaction)
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  if (ct.to != safeState.mySafeAddress && ct.from != safeState.mySafeAddress)
    return;

  ct.cached = true;
  const transactionsById = myTransactions[ct.token] ?? {};
  transactionsById[CirclesToken.getTransactionId(ct)] = ct;
  myTransactions[ct.token] = transactionsById;
}

/**
 * Stores all known transactions to the fission cache.
 */
const updateCacheTrigger = new DelayedTrigger(1000, async () =>
{
  const allTransactions = Object.values(myTransactions)
    .map(transactionsById => Object.values(transactionsById))
    .reduce((p, c) => p.concat(c), []);

  allTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);

  const transactionBlocks: CachedTransactions = {
    name: "transactions",
    entries: {}
  };

  for (let transactionIndex = 0; transactionIndex < allTransactions.length; transactionIndex++)
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
  await Promise.all(Object.keys(tokensByAddress).map(async tokenAddress =>
  {
    const firstBlockWithEvents = Object.values(myTransactions[tokenAddress] ?? {})
      .reduce((p, c) => c.blockNo < p ? c.blockNo : p, Number.MAX_SAFE_INTEGER);

    if (firstBlockWithEvents == Number.MAX_SAFE_INTEGER)
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

/**
 * Goes trough all transactions and looks for transactions without a timestamp.
 *
 * If missing timestamps are discovered then some of the transaction-blocks
 * are loaded and the timestamp will be interpolated from there on over all
 * following transactions with the assumption of a constant block time.
 *
 * When the missing timestamps were added then "myTransactionsSubject" will be
 * updated with a new version of all transactions.
 *
 * TODO: Currently the timestamps for all blocks are set. While this is most likely more precise it costs more requests.. Not yet decided.
 */
const annotateTimeAndStoreToCacheTrigger = new DelayedTrigger(750, async () =>
{
  const web3 = config.getCurrent().web3();

  let avgBlockTime: number = 5;
  let sampleRate: number = 5000;
  let lastTimestamp: number = null;
  let lastTimestampBlockNo: number = null;

  let allTransactions = Object.values(myTransactions)
    .map(transactionsById => Object.values(transactionsById))
    .reduce((p, c) => p.concat(c), []);

  allTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
  console.log("Determining time for " + allTransactions.length + " transactions:", allTransactions);

  for (let transactionIndex = 0; transactionIndex < allTransactions.length; transactionIndex++)
  {
    const transaction = allTransactions[transactionIndex];

    try
    {
      if (!lastTimestamp || transactionIndex % sampleRate == 0)
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

  pushTransactions.trigger();
  updateCacheTrigger.trigger();
});

/**
 * Loads the cached transactions from the fission drive and feeds them into the "transactions" stream.
 */
async function feedCachedTransactions(transactions: Subject<SystemEvent>, tokenAddresses: Address[])
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");

  const cachedTransactions = await fissionAuthState.fission.transactions.tryGetByName("transactions");
  if (!cachedTransactions)
  {
    return;
  }

  const requestedTokensByAddress = {};
  tokenAddresses.forEach(ta => requestedTokensByAddress[ta] = true);

  Object.values(cachedTransactions).forEach((blockEntry: { transactions: CirclesTransaction[] }) =>
  {
    if (!blockEntry.transactions)
    {
      return;
    }

    blockEntry.transactions.forEach(transaction =>
    {
      if (!requestedTokensByAddress[transaction.token])
      {
        return;
      }

      transaction.cached = true;
      transaction.amount = new BN(transaction.amount);
      transactions.next(transaction)
    });
  });
}

const pushTransactions = new DelayedTrigger(35, async () => {
  const allTransactions = Object.values(myTransactions)
    .map(transactionsById => Object.values(transactionsById))
    .reduce((p, c) => p.concat(c), []);

  allTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
  myTransactionsSubject.next(allTransactions);
});

/**
 * Is triggered whenever the list of known tokens changed (after 500 ms delay).
 *
 * Filters the list of all known tokens for new ones, then subscribes
 * to alle Transfer events of the new tokens and reads all history
 * transactions regarding the new tokens.
 *
 * All events are fed into the "transactionStream" from which they
 * are indexed with "indexTransaction()".
 */
const subscribeToTokenEvents = new DelayedTrigger(500, async () =>
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  // Get all known tokens and filter only the new (unsubscribed) ones
  const tokenList = safeState.myKnownTokens.getValue();
  const newTokens = Object.values(tokenList).filter(o => !tokensByAddress[o.tokenAddress]);
  if (newTokens.length == 0)
  {
    return;
  }

  // Pick one of the tokens which will be used to create the subscription
  const aToken = newTokens.length > 0 ? newTokens[0] : null;
  if (!aToken)
  {
    throw new Error("No known tokens");
  }

  // Store the new token addresses in the "tokensByAddress" object
  // so that we known that we've already subscribed to this addresses
  newTokens.forEach(token => tokensByAddress[token.tokenAddress] = token);
  const tokenAddresses = newTokens.map(token => token.tokenAddress);

  // Subscribe to the live events of all "tokenAddresses"
  aToken.subscribeToTransactions(transactionStream, tokensByAddress, tokenAddresses);

  // Get all cached events of all "tokenAddresses"
  await feedCachedTransactions(transactionStream, tokenAddresses);

  // Create a "map" of all tokens, their first appearance as well as block of first an last known transaction
  const cachedBlockMap: {[tokenAddress:string]:{existsSince:number, emptyUntil:number, lastCachedBlock:number}} = {};
  newTokens.forEach(token =>
  {
    const transactionsById = myTransactions[token.tokenAddress];
    if (!transactionsById)
    {
      cachedBlockMap[token.tokenAddress] = {
        lastCachedBlock: token.createdInBlockNo,
        existsSince: token.createdInBlockNo,
        emptyUntil: token.noTransactionsUntilBlockNo
      }
      return;
    }

    const cachedTokenTransactions = Object.values(transactionsById).filter(o => o.cached);
    let lastCachedBlock = cachedTokenTransactions.reduce((p, c) => c.blockNo > p ? c.blockNo : p, token.createdInBlockNo);
    cachedBlockMap[token.tokenAddress] = {
      lastCachedBlock: lastCachedBlock,
      existsSince: token.createdInBlockNo,
      emptyUntil: token.noTransactionsUntilBlockNo
    }
  });

  Object.values(cachedBlockMap).forEach(o => o.lastCachedBlock = o.emptyUntil > o.lastCachedBlock ? o.emptyUntil : o.lastCachedBlock);

  // Find the smallest of all "map"-values and use it as the first block to get historic events
  const firstUnknownBlock = Object.values(cachedBlockMap).reduce((p,c) => c.lastCachedBlock < p ? c.lastCachedBlock : p,
    Number.MAX_SAFE_INTEGER);

  // Show the cached transactions right away then load all other transaction history ..
  pushTransactions.trigger();

  await aToken.feedTransactionHistory(transactionStream, tokensByAddress, tokenAddresses, firstUnknownBlock, "feedTransactionHistory");
  annotateTimeAndStoreToCacheTrigger.trigger();
});

/**
 * Sets the "myTransactions" property of the "OmoSafeState".
 * 1. Reads all cached transactions
 * 2. Subscribes to the Transfer events of all tokens
 * 3. Queries the history of new and known tokens
 */
export async function initMyTransactions()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let counter = 0;
  transactionStream.subscribe(event =>
  {
    counter++;
    if (counter % 100 == 0)
    {
      console.log(`Indexed ${counter} transactions so far ...`);
    }

    indexTransaction(event);
    pushTransactions.trigger();
    annotateTimeAndStoreToCacheTrigger.trigger();
  });

  //
  // Whenever the list of known tokens changes,
  // trigger subscribe to the events of the new tokens.
  //
  safeState.myKnownTokens.subscribe(() => subscribeToTokenEvents.trigger());

  // Set the subject on the safe state so that its available for all following init steps and the running dapp
  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myTransactions: myTransactionsSubject
    }
  });
}
