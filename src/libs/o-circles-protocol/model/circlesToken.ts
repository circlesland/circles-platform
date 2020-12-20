import {Address} from "../interfaces/address";
import {BN} from "ethereumjs-util";
import {Observable, Subject} from "rxjs";
import {DoneSignal, SystemEvent} from "../interfaces/blockchainEvent";
import {Erc20Token} from "../token/erc20Token";
import {config} from "../config";

export class CirclesToken
{
  createdInBlockNo: number;
  tokenAddress: Address;
  tokenOwner: Address;
  balance?: BN;

  private readonly web3 = config.getCurrent().web3();
  private readonly safeAddress:string;

  constructor(safeAddress:string)
  {
    this.safeAddress = safeAddress;
  }

  subscribeToTransactions(fromBlock?:number): Subject<SystemEvent>
  {
    const subject = new Subject<SystemEvent>();

    const erc20Contract = new Erc20Token(this.web3, this.tokenAddress);
    const inTransactionsQuery = erc20Contract.queryEvents(Erc20Token.queryPastTransfers(
      undefined,
      this.safeAddress,
      this.createdInBlockNo));

    inTransactionsQuery.events.subscribe(inTransactionEvent =>
    {
      subject.next(inTransactionEvent);
    });

    const inTxHistory = inTransactionsQuery.execute();

    const outTransactionsQuery = erc20Contract.queryEvents(Erc20Token.queryPastTransfers(
      this.safeAddress,
      undefined,
      fromBlock ?? this.createdInBlockNo));

    outTransactionsQuery.events.subscribe(outTransactionEvent =>
    {
      subject.next(outTransactionEvent);
    });

    const outTxHistory = outTransactionsQuery.execute();

    Promise.all([inTxHistory, outTxHistory]).then(() => {
      subject.next(new DoneSignal(this.tokenAddress));
    });

    return subject;
  }
}
