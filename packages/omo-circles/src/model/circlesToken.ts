import BN from "omo-quirks/dist/BN";
import {config} from "../config";
import {Subscription} from "web3-core-subscriptions";
import {CirclesTransaction} from "omo-models/dist/circles/circlesTransaction";
import {CirclesToken as CirclesTokenModel} from "omo-models/dist/circles/circlesToken"
import {OmoEvent} from "omo-events/dist/omoEvent";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";
import {Signal} from "omo-events/dist/signals/signal";
import {BeginSignal} from "omo-events/dist/signals/beginSignal";
import {ProgressSignal} from "omo-events/dist/signals/progressSignal";
import {EndSignal} from "omo-events/dist/signals/endSignal";
import {BlockchainEvent} from "omo-events/dist/blockchainEvent";

export class CirclesToken implements CirclesTokenModel
{
  private readonly web3 = config.getCurrent().web3();
  private readonly safeAddress: string;

  readonly createdInBlockNo: number;
  readonly tokenAddress: string;
  readonly tokenOwner: string;

  noTransactionsUntilBlockNo: number;
  balance?: BN;

  constructor(
      safeAddress: string,
      tokenAddress: string,
      tokenOwner: string,
      createdInBlockNo: number,
      noTransactionsUntilBlockNo: number)
  {
    this.safeAddress = safeAddress;
    this.tokenAddress = tokenAddress;
    this.tokenOwner = tokenOwner;
    this.createdInBlockNo = createdInBlockNo;
    this.noTransactionsUntilBlockNo = noTransactionsUntilBlockNo;
  }

  wait(milliseconds: number)
  {
    return new Promise<void>(resolve =>
    {
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
  async feedTransactionHistory(
    mySafeAddress: string,
    subject: OmoSubject<OmoEvent>,
    tokensByAddress:{[tokenAddress:string]:CirclesToken},
    tokenAddresses: string[],
    fromBlock: number,
    signalCallback?: (signal:Signal) => void)
  {
    if (signalCallback)
    {
      signalCallback(new BeginSignal());
    }

    const partitionSize = 50000;
    const timeBetweenPartitions = 500;
    const maxTries = 2;

    const topics = [this.web3.utils.sha3('Transfer(address,address,uint256)')];
    const currentBlock = await this.web3.eth.getBlockNumber();
    const partitionCount = Math.ceil((currentBlock - fromBlock) / partitionSize);

    const getFromBlock = (index:number) => fromBlock + index * partitionSize;
    const getToBlock = (index:number) => getFromBlock(index) + partitionSize >= currentBlock
      ? currentBlock
      : getFromBlock(index) + partitionSize;

    for (let partitionIdx = 0; partitionIdx < partitionCount; partitionIdx++)
    {
      let attempt = 1;
      let error = null;

      while (attempt == 1 || (error && attempt <= maxTries))
      {
        try
        {
          if (signalCallback)
          {
            const percent = (partitionIdx + 1) * (100 / partitionCount)

            signalCallback(new ProgressSignal(
              `Updating your transactions ..`, parseInt(percent.toFixed(0))));
          }

          const f = getFromBlock(partitionIdx);
          const t = getToBlock(partitionIdx);
          const pastLogs = await this.web3.eth.getPastLogs({
            address: tokenAddresses,
            fromBlock: f,
            toBlock: t,
            topics: topics
          });

          // window.o.logger.log(`Received ${pastLogs.length} events from block ${f} to ${t} (partition ${partitionIdx + 1} of ${partitionCount}).`)

          pastLogs.forEach(event =>
          {
            const transfer = <BlockchainEvent>{
              type:"blockchain",
              blockNumber: event.blockNumber,
              blockHash: event.blockHash,
              address: event.address,
              event: "Transfer",
              returnValues: {
                from: this.web3.eth.abi.decodeParameter("address", event.topics[1]),
                to: this.web3.eth.abi.decodeParameter("address", event.topics[2]),
                // TODO: Seems to be o.k. according to the docs at https://web3js.readthedocs.io/en/v1.2.7/web3-eth-abi.html#encodeparameter
                value: new BN(<string><any>this.web3.eth.abi.decodeParameter("uint256", event.data)).toString()
              }
            };

            subject.next(CirclesToken.blockchainEventToCirclesTransaction(mySafeAddress, tokensByAddress, transfer));
          });
        }
        catch (e)
        {
          error = e;
          if (attempt < maxTries)
          {
            console.warn("(Try " + attempt + " of " + maxTries + ") An error occurred while loading the transaction history of tokens:", tokenAddresses);
            console.warn(e);
          }
          else
          {
            throw e;
          }
        }
        attempt++;

        await this.wait(timeBetweenPartitions);
      }
    }

    if (signalCallback)
    {
      signalCallback(new EndSignal());
    }
  }

  static getTransactionId(transaction: CirclesTransaction): string
  {
    return `${transaction.blockNo}_${transaction.token}_${transaction.from}_${transaction.to}_${transaction.amount.toString()}`;
  }

  static blockchainEventToCirclesTransaction(mySafeAddress:string, tokensByAddress:{[tokenAddress:string]:CirclesToken}, blockChainEvent:BlockchainEvent)
  {
    const direction = blockChainEvent.returnValues.to == mySafeAddress ? "in" : "out";
    const circlesTransaction = <CirclesTransaction>{
      tokenOwner: tokensByAddress[blockChainEvent.address].tokenOwner,
      token: blockChainEvent.address,
      blockNo: Number.isInteger(blockChainEvent.blockNumber) ? <number><any>blockChainEvent.blockNumber : blockChainEvent.blockNumber,
      from: blockChainEvent.returnValues.from,
      to: blockChainEvent.returnValues.to,
      cached: blockChainEvent.cached,
      amount: BN.isBN(blockChainEvent.returnValues.value) ? <BN>blockChainEvent.returnValues.value : new BN(blockChainEvent.returnValues.value),
      direction: direction,
      subject: "",
      id: ""
    };
    circlesTransaction.id = CirclesToken.getTransactionId(circlesTransaction);
    return circlesTransaction;
  }

  subscribeToTransactions(
      subject:OmoSubject<OmoEvent>,
      mySafeAddress:string,
      tokensByAddress:{[tokenAddress:string]:CirclesToken},
      tokenAddresses:string[])
      : Subscription<any>
  {
    const topics = [this.web3.utils.sha3('Transfer(address,address,uint256)')];
    const subscription = this.web3.eth.subscribe("logs", {
      address: tokenAddresses,
      topics: topics
    });

    return subscription.on("data", event =>
    {
      const transfer = <BlockchainEvent>{
        type:"blockchain",
        blockNumber: event.blockNumber,
        blockHash: event.blockHash,
        address: event.address,
        event: "Transfer",
        returnValues: {
          from: this.web3.eth.abi.decodeParameter("address", event.topics[1]),
          to: this.web3.eth.abi.decodeParameter("address", event.topics[2]),
          // TODO: Seems to be o.k. according to the docs at https://web3js.readthedocs.io/en/v1.2.7/web3-eth-abi.html#encodeparameter
          value: new BN(<string><any>this.web3.eth.abi.decodeParameter("uint256", event.data)).toString()
        }
      };

      subject.next(CirclesToken.blockchainEventToCirclesTransaction(mySafeAddress, tokensByAddress, transfer));
    });
  }
}
