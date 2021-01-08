var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BehaviorSubject, Subject } from "rxjs";
import { setDappState, tryGetDappState } from "../../../libs/o-os/loader";
import { BN } from "ethereumjs-util";
import { DelayedTrigger } from "../../../libs/o-os/delayedTrigger";
import { CirclesToken } from "../../../libs/o-circles-protocol/model/circlesToken";
import { config } from "../../../libs/o-circles-protocol/config";
import { runWithDrive } from "../../../libs/o-fission/initFission";
// The consumable output of this init step (deduplicated ordered list of transactions)
const myTransactionsSubject = new BehaviorSubject([]);
// In-memory cache of all transactions
const myTransactions = {};
// Contains all known tokens to which we've already subscribed
const tokensByAddress = {};
// All incoming raw transactions are passed trough this stream.
const transactionStream = new Subject();
function indexTransaction(ct) {
    var _a;
    const safeState = tryGetDappState("omo.safe:1");
    if (ct.to != safeState.mySafeAddress && ct.from != safeState.mySafeAddress)
        return;
    ct.cached = true;
    const transactionsById = (_a = myTransactions[ct.token]) !== null && _a !== void 0 ? _a : {};
    transactionsById[CirclesToken.getTransactionId(ct)] = ct;
    myTransactions[ct.token] = transactionsById;
}
/**
 * Stores all known transactions to the fission cache.
 */
const updateCacheTrigger = new DelayedTrigger(1000, () => __awaiter(void 0, void 0, void 0, function* () {
    const allTransactions = Object.values(myTransactions)
        .map(transactionsById => Object.values(transactionsById))
        .reduce((p, c) => p.concat(c), []);
    allTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
    const transactionBlocks = {
        name: "transactions",
        entries: {}
    };
    for (let transactionIndex = 0; transactionIndex < allTransactions.length; transactionIndex++) {
        const transaction = allTransactions[transactionIndex];
        const serializableTransaction = Object.assign(Object.assign({}, transaction), { amount: transaction.amount.toString() });
        if (!transactionBlocks[transaction.blockNo]) {
            transactionBlocks[transaction.blockNo] = {
                timestamp: transaction.timestamp,
                transactions: [serializableTransaction]
            };
        }
        else {
            transactionBlocks[transaction.blockNo].transactions.push(serializableTransaction);
        }
    }
    window.o.logger.log("Writing transactions to fission cache ...");
    yield runWithDrive((fissionDrive) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield fissionDrive.transactions.addOrUpdate(transactionBlocks);
        const currentBlock = yield config.getCurrent().web3().eth.getBlockNumber();
        // Go trough all tokens and find the first block that contains a transactions
        const existingKnownTokensList = (_a = (yield fissionDrive.tokens.tryGetByName("tokens"))) !== null && _a !== void 0 ? _a : { entries: {} };
        yield Promise.all(Object.keys(tokensByAddress).map((tokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const firstBlockWithEvents = Object.values((_b = myTransactions[tokenAddress]) !== null && _b !== void 0 ? _b : {})
                .reduce((p, c) => c.blockNo < p ? c.blockNo : p, Number.MAX_SAFE_INTEGER);
            if (!existingKnownTokensList.entries[tokenAddress]) {
                existingKnownTokensList.entries[tokenAddress] = {
                    name: "",
                    noTransactionsUntilBlockNo: tokensByAddress[tokenAddress].noTransactionsUntilBlockNo,
                    createdInBlockNo: tokensByAddress[tokenAddress].createdInBlockNo,
                    tokenAddress: tokensByAddress[tokenAddress].tokenAddress,
                    tokenOwner: tokensByAddress[tokenAddress].tokenOwner
                };
            }
            if (firstBlockWithEvents == Number.MAX_SAFE_INTEGER) {
                // No events till now
                existingKnownTokensList.entries[tokenAddress].noTransactionsUntilBlockNo = currentBlock;
            }
        })));
        yield fissionDrive.tokens.addOrUpdate(existingKnownTokensList);
        window.o.logger.log("Wrote transactions to fission cache.");
    }));
}));
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
const annotateTimeAndStoreToCacheTrigger = new DelayedTrigger(2500, () => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = config.getCurrent().web3();
    let avgBlockTime = 5;
    let sampleRate = 5000;
    let lastTimestamp = null;
    let lastTimestampBlockNo = null;
    let allTransactions = Object.values(myTransactions)
        .map(transactionsById => Object.values(transactionsById))
        .reduce((p, c) => p.concat(c), []);
    allTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
    window.o.logger.log("Determining time for " + allTransactions.length + " transactions:", allTransactions);
    for (let transactionIndex = 0; transactionIndex < allTransactions.length; transactionIndex++) {
        const transaction = allTransactions[transactionIndex];
        try {
            if (!lastTimestamp || transactionIndex % sampleRate == 0) {
                if (transaction.timestamp) {
                    lastTimestamp = transaction.timestamp;
                    lastTimestampBlockNo = transaction.blockNo;
                }
                else {
                    const block = yield web3.eth.getBlock(transaction.blockNo);
                    lastTimestamp = block.timestamp;
                    lastTimestampBlockNo = transaction.blockNo;
                }
            }
            const passedBlocksSinceLastTimestampBlockNo = lastTimestampBlockNo - transaction.blockNo;
            const passedSecondsSinceLastTimestamp = passedBlocksSinceLastTimestampBlockNo * avgBlockTime;
            const currentBlockTimestamp = lastTimestamp - passedSecondsSinceLastTimestamp;
            if (!transaction.cached || !transaction.timestamp) {
                transaction.timestamp = currentBlockTimestamp;
            }
        }
        catch (e) {
            console.warn("Couldn't determine the time of block " + transaction.blockNo + ": " + e.toString());
        }
    }
    pushTransactions.trigger();
    updateCacheTrigger.trigger();
}));
/**
 * Loads the cached transactions from the fission drive and feeds them into the "transactions" stream.
 */
function feedCachedTransactions(transactions, tokenAddresses) {
    return __awaiter(this, void 0, void 0, function* () {
        yield runWithDrive((fissionDrive) => __awaiter(this, void 0, void 0, function* () {
            const cachedTransactions = yield fissionDrive.transactions.tryGetByName("transactions");
            if (!cachedTransactions) {
                return;
            }
            const requestedTokensByAddress = {};
            tokenAddresses.forEach(ta => requestedTokensByAddress[ta] = true);
            Object.values(cachedTransactions).forEach((blockEntry) => {
                if (!blockEntry.transactions) {
                    return;
                }
                blockEntry.transactions.forEach(transaction => {
                    if (!requestedTokensByAddress[transaction.token]) {
                        return;
                    }
                    transaction.cached = true;
                    transaction.amount = new BN(transaction.amount);
                    transactions.next(transaction);
                });
            });
        }));
    });
}
const pushTransactions = new DelayedTrigger(35, () => __awaiter(void 0, void 0, void 0, function* () {
    const allTransactions = Object.values(myTransactions)
        .map(transactionsById => Object.values(transactionsById))
        .reduce((p, c) => p.concat(c), []);
    allTransactions.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
    myTransactionsSubject.next(allTransactions);
}));
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
const subscribeToTokenEvents = new DelayedTrigger(500, () => __awaiter(void 0, void 0, void 0, function* () {
    const safeState = tryGetDappState("omo.safe:1");
    // Get all known tokens and filter only the new (unsubscribed) ones
    const tokenList = safeState.myKnownTokens.getValue();
    const newTokens = Object.values(tokenList).filter(o => !tokensByAddress[o.tokenAddress]);
    if (newTokens.length == 0) {
        return;
    }
    // Pick one of the tokens which will be used to create the subscription
    const aToken = newTokens.length > 0 ? newTokens[0] : null;
    if (!aToken) {
        throw new Error("No known tokens");
    }
    // Store the new token addresses in the "tokensByAddress" object
    // so that we known that we've already subscribed to this addresses
    newTokens.forEach(token => tokensByAddress[token.tokenAddress] = token);
    const tokenAddresses = newTokens.map(token => token.tokenAddress);
    // Subscribe to the live events of all "tokenAddresses"
    aToken.subscribeToTransactions(transactionStream, tokensByAddress, tokenAddresses);
    // Get all cached events of all "tokenAddresses"
    yield feedCachedTransactions(transactionStream, tokenAddresses);
    // Create a "map" of all tokens, their first appearance as well as block of first an last known transaction
    const cachedBlockMap = {};
    newTokens.forEach(token => {
        const transactionsById = myTransactions[token.tokenAddress];
        if (!transactionsById) {
            cachedBlockMap[token.tokenAddress] = {
                lastCachedBlock: token.createdInBlockNo,
                existsSince: token.createdInBlockNo,
                emptyUntil: token.noTransactionsUntilBlockNo
            };
            return;
        }
        const cachedTokenTransactions = Object.values(transactionsById).filter(o => o.cached);
        let lastCachedBlock = cachedTokenTransactions.reduce((p, c) => c.blockNo > p ? c.blockNo : p, token.createdInBlockNo);
        cachedBlockMap[token.tokenAddress] = {
            lastCachedBlock: lastCachedBlock,
            existsSince: token.createdInBlockNo,
            emptyUntil: token.noTransactionsUntilBlockNo
        };
    });
    Object.values(cachedBlockMap).forEach(o => o.lastCachedBlock = o.emptyUntil > o.lastCachedBlock
        ? o.emptyUntil
        : o.lastCachedBlock);
    // Find the smallest of all "map"-values and use it as the first block to get historic events
    const firstUnknownBlock = Object.values(cachedBlockMap).reduce((p, c) => c.lastCachedBlock < p ? c.lastCachedBlock : p, Number.MAX_SAFE_INTEGER);
    // Show the cached transactions right away then load all other transaction history ..
    pushTransactions.trigger();
    yield aToken.feedTransactionHistory(transactionStream, tokensByAddress, tokenAddresses, firstUnknownBlock, "feedTransactionHistory");
    annotateTimeAndStoreToCacheTrigger.trigger();
}));
/**
 * Sets the "myTransactions" property of the "OmoSafeState".
 * 1. Reads all cached transactions
 * 2. Subscribes to the Transfer events of all tokens
 * 3. Queries the history of new and known tokens
 */
export function initMyTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        const safeState = tryGetDappState("omo.safe:1");
        let counter = 0;
        transactionStream.subscribe(event => {
            counter++;
            if (counter % 100 == 0) {
                window.o.logger.log(`Indexed ${counter} transactions so far ...`);
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
        setDappState("omo.safe:1", existing => {
            return Object.assign(Object.assign({}, existing), { myTransactions: myTransactionsSubject });
        });
    });
}
