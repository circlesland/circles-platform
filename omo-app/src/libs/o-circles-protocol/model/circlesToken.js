var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BN } from "ethereumjs-util";
import { BeginSignal, EndSignal, ProgressSignal } from "../interfaces/blockchainEvent";
import { config } from "../config";
import { tryGetDappState } from "../../o-os/loader";
export class CirclesToken {
    constructor(safeAddress) {
        this.web3 = config.getCurrent().web3();
        this.safeAddress = safeAddress;
    }
    wait(milliseconds) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), milliseconds);
        });
    }
    /**
     * Feeds the transaction history of the specified tokens to the given subject.
     * @param subject The stream
     * @param tokenAddresses The tokens
     * @param fromBlock Start block
     * @param signalKey If a "BeginSignal" and "EndSignal" event should be put on the stream then this parameter must have a value.
     */
    feedTransactionHistory(subject, tokensByAddress, tokenAddresses, fromBlock, signalCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (signalCallback) {
                signalCallback(new BeginSignal(""));
            }
            const partitionSize = 50000;
            const timeBetweenPartitions = 500;
            const maxTries = 2;
            const topics = [this.web3.utils.sha3('Transfer(address,address,uint256)')];
            const currentBlock = yield this.web3.eth.getBlockNumber();
            const partitionCount = Math.ceil((currentBlock - fromBlock) / partitionSize);
            const getFromBlock = (index) => fromBlock + index * partitionSize;
            const getToBlock = (index) => getFromBlock(index) + partitionSize >= currentBlock
                ? currentBlock
                : getFromBlock(index) + partitionSize;
            for (let partitionIdx = 0; partitionIdx < partitionCount; partitionIdx++) {
                let attempt = 1;
                let error = null;
                while (attempt == 1 || (error && attempt <= maxTries)) {
                    try {
                        if (signalCallback) {
                            const percent = (partitionIdx + 1) * (100 / partitionCount);
                            signalCallback(new ProgressSignal("", `Updating your transactions ..`, parseInt(percent.toFixed(0))));
                        }
                        const f = getFromBlock(partitionIdx);
                        const t = getToBlock(partitionIdx);
                        const pastLogs = yield this.web3.eth.getPastLogs({
                            address: tokenAddresses,
                            fromBlock: f,
                            toBlock: t,
                            topics: topics
                        });
                        window.o.logger.log(`Received ${pastLogs.length} events from block ${f} to ${t} (partition ${partitionIdx + 1} of ${partitionCount}).`);
                        pastLogs.forEach(event => {
                            const transfer = {
                                type: "blockchain",
                                blockNumber: event.blockNumber,
                                blockHash: event.blockHash,
                                address: event.address,
                                event: "Transfer",
                                returnValues: {
                                    from: this.web3.eth.abi.decodeParameter("address", event.topics[1]),
                                    to: this.web3.eth.abi.decodeParameter("address", event.topics[2]),
                                    value: new BN(this.web3.eth.abi.decodeParameter("uint256", event.data)).toString()
                                }
                            };
                            subject.next(CirclesToken.blockchainEventToCirclesTransaction(tokensByAddress, transfer));
                        });
                    }
                    catch (e) {
                        error = e;
                        if (attempt < maxTries) {
                            console.warn("(Try " + attempt + " of " + maxTries + ") An error occurred while loading the transaction history of tokens:", tokenAddresses);
                            console.warn(e);
                        }
                        else {
                            throw e;
                        }
                    }
                    attempt++;
                    yield this.wait(timeBetweenPartitions);
                }
            }
            if (signalCallback) {
                signalCallback(new EndSignal(""));
            }
        });
    }
    static getTransactionId(transaction) {
        return `${transaction.blockNo}_${transaction.token}_${transaction.from}_${transaction.to}_${transaction.amount.toString()}`;
    }
    static blockchainEventToCirclesTransaction(tokensByAddress, blockChainEvent) {
        const safeState = tryGetDappState("omo.safe:1");
        const direction = blockChainEvent.returnValues.to == safeState.mySafeAddress ? "in" : "out";
        const circlesTransaction = {
            tokenOwner: tokensByAddress[blockChainEvent.address].tokenOwner,
            token: blockChainEvent.address,
            blockNo: Number.isInteger(blockChainEvent.blockNumber) ? blockChainEvent.blockNumber : blockChainEvent.blockNumber.toNumber(),
            from: blockChainEvent.returnValues.from,
            to: blockChainEvent.returnValues.to,
            cached: blockChainEvent.cached,
            amount: BN.isBN(blockChainEvent.returnValues.value) ? blockChainEvent.returnValues.value : new BN(blockChainEvent.returnValues.value),
            direction: direction,
            subject: "",
            id: ""
        };
        circlesTransaction.id = CirclesToken.getTransactionId(circlesTransaction);
        return circlesTransaction;
    }
    subscribeToTransactions(subject, tokensByAddress, tokenAddresses) {
        const topics = [this.web3.utils.sha3('Transfer(address,address,uint256)')];
        const subscription = this.web3.eth.subscribe("logs", {
            address: tokenAddresses,
            topics: topics
        });
        return subscription.on("data", event => {
            const transfer = {
                type: "blockchain",
                blockNumber: event.blockNumber,
                blockHash: event.blockHash,
                address: event.address,
                event: "Transfer",
                returnValues: {
                    from: this.web3.eth.abi.decodeParameter("address", event.topics[1]),
                    to: this.web3.eth.abi.decodeParameter("address", event.topics[2]),
                    value: new BN(this.web3.eth.abi.decodeParameter("uint256", event.data)).toString()
                }
            };
            subject.next(CirclesToken.blockchainEventToCirclesTransaction(tokensByAddress, transfer));
        });
    }
}
