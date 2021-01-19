import BN from "omo-quirks/dist/BN";
import {OmoSafeState} from "../manifest";
import {Logger} from "omo-utils/dist/logger";
import {DelayedTrigger} from "omo-utils/dist/delayedTrigger";
import {CirclesTransaction} from "omo-models/dist/circles/circlesTransaction";
import {CirclesToken} from "omo-circles/dist/model/circlesToken";
import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
import {CachedTransactions} from "omo-models/dist/omo/cachedTransactions";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {config} from "omo-circles/dist/config";
import {Token} from "omo-models/dist/omo/token";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {CachedTokens} from "omo-models/dist/omo/cachedTokens";
import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";

type TransactionList = {
  [token: string]: {
    [id: string]: CirclesTransaction
  }
}

let initMyTransactionLogger:Logger;

// The consumable output of this init step (deduplicated ordered list of transactions)
const myTransactionsSubject: OmoBehaviorSubject<StatePropagation<CirclesTransaction[]>> = new OmoBehaviorSubject<StatePropagation<CirclesTransaction[]>>({
  payload: []
});

// In-memory cache of all transactions
const myTransactions: TransactionList = {};

// Contains all known tokens to which we've already subscribed
const tokensByAddress: { [address: string]: CirclesToken } = {};

// All incoming raw transactions are passed trough this stream.
const transactionStream: OmoSubject<CirclesTransaction> = new OmoSubject<CirclesTransaction>();


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

  window.o.logger.log("Writing transactions to fission cache ...");
  await runWithDrive(async fissionDrive =>
  {
    await fissionDrive.transactions.addOrUpdateEntity(transactionBlocks);
    const currentBlock = await config.getCurrent().web3().eth.getBlockNumber();

    // Go trough all tokens and find the first block that contains a transactions
    const existingKnownTokensList = (await fissionDrive.tokens.tryGetEntityByName("tokens")) ?? <CachedTokens>{entries: {}};
    await Promise.all(Object.keys(tokensByAddress).map(async tokenAddress =>
    {
      const firstBlockWithEvents = Object.values(myTransactions[tokenAddress] ?? {})
        .reduce((p, c) => c.blockNo < p ? c.blockNo : p, Number.MAX_SAFE_INTEGER);

      if (!existingKnownTokensList.entries[tokenAddress])
      {
        existingKnownTokensList.entries[tokenAddress] = <Token>{
          name: "",
          noTransactionsUntilBlockNo: tokensByAddress[tokenAddress].noTransactionsUntilBlockNo,
          createdInBlockNo: tokensByAddress[tokenAddress].createdInBlockNo,
          tokenAddress: tokensByAddress[tokenAddress].tokenAddress,
          tokenOwner: tokensByAddress[tokenAddress].tokenOwner
        };
      }

      if (firstBlockWithEvents == Number.MAX_SAFE_INTEGER)
      {
        // No events till now
        existingKnownTokensList.entries[tokenAddress].noTransactionsUntilBlockNo = currentBlock;
      }
    }));

    await fissionDrive.tokens.addOrUpdateEntity(existingKnownTokensList);
    window.o.logger.log("Wrote transactions to fission cache.");
  });
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
const annotateTimeAndStoreToCacheTrigger = new DelayedTrigger(2500, async () =>
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
  window.o.logger.log("Determining time for " + allTransactions.length + " transactions ..");

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
          if (typeof block.timestamp === "string")
          {
            lastTimestamp = parseInt(block.timestamp);
          }
          else
          {
            lastTimestamp = block.timestamp;
          }
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
  window.o.logger.log("Determining time for " + allTransactions.length + " transactions .. Done.");

  pushTransactions.trigger();
  updateCacheTrigger.trigger();
});

/**
 * Loads the cached transactions from the fission drive and feeds them into the "transactions" stream.
 */
async function feedCachedTransactions(transactions: OmoSubject<OmoEvent>, tokenAddresses: string[])
{
  await runWithDrive(async fissionDrive =>
  {
    const cachedTransactions = await fissionDrive.transactions.tryGetEntityByName("transactions");
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
        transactions.next(
           transaction
        )
      });
    });
  });
}

const pushTransactions = new DelayedTrigger(35, async () => {
  const allTransactions = Object.values(myTransactions)
    .map(transactionsById => Object.values(transactionsById))
    .reduce((p, c) => p.concat(c), []);

  allTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);

  const current = myTransactionsSubject.getValue();
  myTransactionsSubject.next({
    signal: current?.signal,
    payload: allTransactions
  });
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
  const tokenList = safeState.myKnownTokens.getValue().payload;
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
  aToken.subscribeToTransactions(transactionStream, safeState.mySafeAddress, tokensByAddress, tokenAddresses);

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

  Object.values(cachedBlockMap).forEach(o => o.lastCachedBlock = o.emptyUntil > o.lastCachedBlock
    ? o.emptyUntil
    : o.lastCachedBlock);

  // Find the smallest of all "map"-values and use it as the first block to get historic events
  const firstUnknownBlock = Object.values(cachedBlockMap).reduce((p,c) => c.lastCachedBlock < p ? c.lastCachedBlock : p,
    Number.MAX_SAFE_INTEGER);

  // Show the cached transactions right away then load all other transaction history ..
  pushTransactions.trigger();

  await aToken.feedTransactionHistory(
    safeState.mySafeAddress,
    transactionStream,
    tokensByAddress,
    tokenAddresses,
    firstUnknownBlock,
    signal => {
      const currentTransactionsList = safeState.myTransactions.getValue();
      safeState.myTransactions.next({
        signal: signal,
        payload: currentTransactionsList.payload
      });
    });
  annotateTimeAndStoreToCacheTrigger.trigger();
});

/**
 * Sets the "myTransactions" property of the "OmoSafeState".
 * 1. Reads all cached transactions
 * 2. Subscribes to the Transfer events of all tokens
 * 3. Queries the history of new and known tokens
 */
export async function initMyTransactions(logger:Logger)
{
  initMyTransactionLogger = logger.newLogger("initMyTransaction()")
  initMyTransactionLogger.log("begin");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let counter = 0;
  transactionStream.subscribe(event =>
  {
    counter++;
    if (counter % 100 == 0)
    {
      initMyTransactionLogger.log(`Indexed ${counter} transactions so far ...`);
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

  initMyTransactionLogger.log("end");
}
