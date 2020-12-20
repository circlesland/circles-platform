import {BehaviorSubject} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {config} from "../../../libs/o-circles-protocol/config";
import {CacheEvent} from "../../../libs/o-fission/entities/cacheEvent";
import {Event} from "../../../libs/o-circles-protocol/interfaces/event";
import {BN} from "ethereumjs-util";
import {Erc20Token} from "../../../libs/o-circles-protocol/token/erc20Token";
import {BlockIndex} from "./blockIndex";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";
import {CirclesToken, CirclesTransaction} from "../../../libs/o-circles-protocol/queryModel/circlesAccount";
import {OmoSafeState} from "../manifest";

function mapTransactionEvent(token:CirclesToken, transactionEvent: CacheEvent | Event)
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const ev = <Event>transactionEvent;
  return <CirclesTransaction>{
    token: token.tokenAddress,
    tokenOwner: token.tokenOwner,
    direction: ev.returnValues.from == safeState.mySafeAddress ? "out" : "in",
    from: ev.returnValues.from,
    to: ev.returnValues.to,
    amount: new BN(ev.returnValues.value),
    subject: "",
    timestamp: new Date(),
    blockNo: ev.blockNumber.toNumber()
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

const updateTrigger = new DelayedTrigger(30, async () =>
{
  const allTransactions = Object.values(myTransactions)
    .map(transactionsById => Object.values(transactionsById))
    .reduce((p,c) => p.concat(c), []);

  allTransactions.sort((a,b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
  myTransactionsSubject.next(allTransactions);
});


function indexTransaction(token, transactionEvent)
{
  blockIndex.addBlock(transactionEvent.blockNumber);
  const circlesTransaction = mapTransactionEvent(token, transactionEvent);
  const transactionsById = myTransactions[token.tokenAddress] ?? { };
  transactionsById[getTransactionId(circlesTransaction)] = circlesTransaction;
  myTransactions[token.tokenAddress] = transactionsById;
}

function getTransactionId(transaction:CirclesTransaction):string
{
  return `${transaction.blockNo}_${transaction.token}_${transaction.from}_${transaction.to}_${transaction.amount.toString()}`;
}

export async function initMyTransactions()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const cfg = config.getCurrent();
  const web3 = cfg.web3();

  safeState.myKnownTokens.subscribe(async tokenList =>
  {
    const unsubscribedTokens = Object.values(tokenList).filter(o => !myTransactions[o.tokenAddress]);
    if (unsubscribedTokens.length == 0)
    {
      return;
    }

    unsubscribedTokens.forEach(unsubscribedToken =>
    {
      const erc20Contract = new Erc20Token(web3, unsubscribedToken.tokenAddress);
      const inTransactionsQuery = erc20Contract.queryEvents(Erc20Token.queryPastTransfers(
        undefined,
        safeState.mySafeAddress,
        unsubscribedToken.createdInBlockNo));

      inTransactionsQuery.events.subscribe(inTransactionEvent =>
      {
        indexTransaction(unsubscribedToken, inTransactionEvent);
        updateTrigger.trigger();
      });

      inTransactionsQuery.execute();

      const outTransactionsQuery = erc20Contract.queryEvents(Erc20Token.queryPastTransfers(
        safeState.mySafeAddress,
        undefined,
        unsubscribedToken.createdInBlockNo));

      outTransactionsQuery.events.subscribe(outTransactionEvent =>
      {
        indexTransaction(unsubscribedToken, outTransactionEvent);
        updateTrigger.trigger();
      });

      outTransactionsQuery.execute();
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
