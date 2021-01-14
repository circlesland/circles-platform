var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Subject } from "rxjs";
import BN from "bn.js";
import { config } from "./config";
import { Transaction } from "ethereumjs-tx";
import { filter, map } from "rxjs/operators";
import { isArray } from "rxjs/internal-compatibility";
import { EventQuery } from "./eventQuery";
export class Web3Contract {
    constructor(web3, contractAddress, contractInstance) {
        this._pastEvents = new Subject();
        if (!web3)
            throw new Error("The 'web3' parameter must be set.");
        if (!web3.utils.isAddress(contractAddress))
            throw new Error("The 'contractAddress' parameter is not a valid ethereum address.");
        if (!contractInstance)
            throw new Error("The 'contractInstance' parameter must have a valid value.");
        this.web3 = web3;
        this.address = contractAddress;
        this.contract = contractInstance;
    }
    /**
     * Gets all last events that conform to the query specification and feeds the to all subscribers.
     * @param options
     */
    feedPastEvents(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.contract.getPastEvents(options.event, options);
            result.forEach(event => this._pastEvents.next(event));
            return result.length;
        });
    }
    /**
     * Creates an executable query object from the passed options.
     * @param options
     */
    // TODO: Add a timeout
    queryEvents(options) {
        const filterPredicate = (event) => {
            if (event.event != options.event) {
                return false;
            }
            // TODO: Filter all other properties too (blockNo, blockHash, ... - currently only the event.returnValues are filtered)
            return !options.filter
                ? true
                : Object.keys(options.filter)
                    .map(field => {
                    var _a;
                    return (options.filter && isArray(options.filter[field]) && options.filter[field].find(o => o == event.returnValues[field])) ||
                        (event.returnValues[field] == ((_a = (options.filter && options.filter[field])) !== null && _a !== void 0 ? _a : null));
                })
                    .reduce((p, c) => p && c, true);
        };
        const self = this;
        return new EventQuery(() => self.feedPastEvents(options), self.events([options.event])
            .pipe(filter(filterPredicate), map((event) => {
            var _a;
            return ({
                address: event.address,
                blockNumber: new BN(event.blockNumber),
                blockHash: event.blockHash,
                event: event.event,
                returnValues: (_a = event.returnValues) !== null && _a !== void 0 ? _a : {}
            });
        })));
    }
    /**
     * Subscribes to all of the passed events and returns an Observable instance.
     * @param events
     */
    events(events) {
        const subject = new Subject(); //subscriber =>
        //{
        this._pastEvents.subscribe(next => subject.next(next));
        for (let event of events) {
            const e = this.contract.events[event];
            if (!e)
                throw new Error(`There is no event with the name '${event}' on the ABI description.`);
            this.contract.events[event]()
                .on('data', (event) => subject.next(event));
        }
        // });
        return subject;
    }
    static signRawTransaction(ownerAddress, privateKey, to, data, gasLimit, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfg = config.getCurrent();
            const web3 = cfg.web3();
            const ethJsCommon = yield config.getCurrent().ethjs.getCommon(web3);
            const nonce = "0x" + new BN(yield web3.eth.getTransactionCount(ownerAddress)).toString("hex");
            const rawTx = {
                gasPrice: "0x" + config.getCurrent().getGasPrice(web3).toString("hex"),
                gasLimit: "0x" + gasLimit.toString("hex"),
                to: to,
                value: "0x" + value.toString("hex"),
                data: data,
                nonce: nonce
            };
            const txOptions = ethJsCommon
                ? { common: ethJsCommon }
                : {};
            const tx = new Transaction(rawTx, txOptions);
            tx.sign(Buffer.from(privateKey.slice(2), "hex"));
            return '0x' + tx.serialize().toString('hex');
        });
    }
    static sendSignedRawTransaction(serializedTx) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = config.getCurrent().web3();
            return new Promise((resolve, reject) => {
                web3.eth.sendSignedTransaction(serializedTx)
                    .once('transactionHash', (hash) => {
                    window.o.logger.log("web3.eth.sendSignedTransaction | Got transaction hash: " + hash);
                })
                    .once('receipt', (receipt) => {
                    window.o.logger.log("web3.eth.sendSignedTransaction | Got receipt:", receipt);
                })
                    .once('confirmation', (confNumber) => {
                    window.o.logger.log("web3.eth.sendSignedTransaction | Got confirmation. Conf No.: " + confNumber);
                })
                    .once('error', (error) => {
                    window.o.logger.log("web3.eth.sendSignedTransaction | Got error:", error);
                    reject(error);
                })
                    .then(function (receipt) {
                    window.o.logger.log("web3.eth.sendSignedTransaction | Transaction was mined.");
                    resolve(receipt);
                });
            });
        });
    }
}
