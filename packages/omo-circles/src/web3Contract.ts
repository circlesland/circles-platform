import type { Contract, PastEventOptions } from "web3-eth-contract";
import { Subject } from "rxjs";
import type Web3 from "web3";
import BN from "bn.js";
import type Common from "ethereumjs-common";
import { config } from "./config";
import { Transaction, TxData } from "ethereumjs-tx";
import { filter, map } from "rxjs/operators";
import { EventQuery } from "./eventQuery";
import type { TransactionReceipt } from "web3-core";
import {BlockchainEvent} from "omo-events/dist/blockchainEvent";

export abstract class Web3Contract {
  readonly web3: Web3;
  readonly address: string;
  readonly contract: Contract;

  protected readonly _pastEvents: Subject<any> = new Subject<any>();

  constructor(web3: Web3, contractAddress: string, contractInstance: Contract) {
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
  async feedPastEvents(options: PastEventOptions & { event: string }) {
    const result = await this.contract.getPastEvents(options.event, options);
    result.forEach(event => this._pastEvents.next(event));
    return result.length;
  }

  /**
   * Creates an executable query object from the passed options.
   * @param options
   */
  // TODO: Add a timeout
  queryEvents(options: PastEventOptions & { event: string })
    : EventQuery<BlockchainEvent> {
    const filterPredicate = (event: BlockchainEvent): boolean => {
      if (event.event != options.event) {
        return false;
      }

      // TODO: Filter all other properties too (blockNo, blockHash, ... - currently only the event.returnValues are filtered)
      return !options.filter
        ? true
        : Object.keys(options.filter)
          .map(field =>
            (options.filter
                && Array.isArray(options.filter[field])
                && (<any[]>options.filter[field])
                    .find(o => o == event.returnValues[field]))
              || (event.returnValues[field] == ((options.filter && options.filter[field]) ?? null)))
          .reduce((p, c) => p && c, true);
    };

    const self = this;

    return new EventQuery(
      () => self.feedPastEvents(options),
      self.events([options.event])
        .pipe(
          filter(filterPredicate),
          map((event) => <BlockchainEvent>{
            type: "blockchain",
            address: event.address,
            blockNumber: event.blockNumber,
            blockHash: event.blockHash,
            event: event.event,
            returnValues: event.returnValues ?? {}
          })
        )
    );
  }

  /**
   * Subscribes to all of the passed events and returns an Observable instance.
   * @param events
   */
  events(events: string[]) {
    const subject = new Subject<any>();
    this._pastEvents.subscribe(next => subject.next(next));

    for (let event of events) {
      const e = this.contract.events[event];
      if (!e)
        throw new Error(`There is no event with the name '${event}' on the ABI description.`);

      this.contract.events[event]()
        .on('data', (event: any) => subject.next(event));
    }

    return subject;
  }

  static async signRawTransaction(ownerAddress: string, privateKey: string, to: string, data: string, gasLimit: BN, value: BN)
    : Promise<string> {
    const cfg = config.getCurrent();
    const web3 = cfg.web3();
    const ethJsCommon: Common = await config.getCurrent().ethjs.getCommon(web3);
    const nonce = "0x" + new BN(await web3.eth.getTransactionCount(ownerAddress)).toString("hex");

    const rawTx: TxData = {
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
  }

  static async sendSignedRawTransaction(serializedTx: string) {
    const web3 = config.getCurrent().web3();
    return new Promise<TransactionReceipt>((resolve, reject) => {
      web3.eth.sendSignedTransaction(serializedTx)
        /*.once('transactionHash', (hash) => {
          window.o.logger.log("web3.eth.sendSignedTransaction | Got transaction hash: " + hash);
        })
        .once('receipt', (receipt) => {
          window.o.logger.log("web3.eth.sendSignedTransaction | Got receipt:", receipt);
        })
        .once('confirmation', (confNumber) => {
          window.o.logger.log("web3.eth.sendSignedTransaction | Got confirmation. Conf No.: " + confNumber);
        })*/
        .once('error', (error) => {
          reject(error);
        })
        .then(function (receipt) {
          resolve(receipt);
        });
    });
  }
}
