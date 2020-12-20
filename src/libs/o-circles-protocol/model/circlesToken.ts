import {Address} from "../interfaces/address";
import {BN} from "ethereumjs-util";
import {Observable, Subject} from "rxjs";
import {Event} from "../interfaces/event";
import {Erc20Token} from "../token/erc20Token";
import {config} from "../config";
import {CirclesHub} from "../circles/circlesHub";

export class CirclesToken
{
  createdInBlockNo: number;
  tokenAddress: Address;
  tokenOwner: Address;
  balance?: BN;

  private readonly cfg = config.getCurrent();
  private readonly web3 = config.getCurrent().web3();
  private readonly hub:CirclesHub;
  private readonly safeAddress:string;

  constructor(safeAddress:string)
  {
    this.safeAddress = safeAddress;
  }

  subscribeToTransactions(): Observable<Event>
  {
    const subject = new Subject<Event>();

    const erc20Contract = new Erc20Token(this.web3, this.tokenAddress);
    const inTransactionsQuery = erc20Contract.queryEvents(Erc20Token.queryPastTransfers(
      undefined,
      this.safeAddress,
      this.createdInBlockNo));

    inTransactionsQuery.events.subscribe(inTransactionEvent =>
    {
      subject.next(inTransactionEvent);
    });

    inTransactionsQuery.execute();

    const outTransactionsQuery = erc20Contract.queryEvents(Erc20Token.queryPastTransfers(
      this.safeAddress,
      undefined,
      this.createdInBlockNo));

    outTransactionsQuery.events.subscribe(outTransactionEvent =>
    {
      subject.next(outTransactionEvent);
    });

    outTransactionsQuery.execute();

    return subject;
  }
}
