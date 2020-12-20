import {BehaviorSubject} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {config} from "../../../libs/o-circles-protocol/config";
import {CacheEvent} from "../../../libs/o-fission/entities/cacheEvent";
import {Event} from "../../../libs/o-circles-protocol/interfaces/event";
import {BN} from "ethereumjs-util";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";
import {OmoSafeState} from "../manifest";
import {CirclesToken} from "../../../libs/o-circles-protocol/model/circlesToken";
import {CirclesTransaction} from "../../../libs/o-circles-protocol/model/circlesTransaction";
import {CirclesAccount} from "../../../libs/o-circles-protocol/model/circlesAccount";
import {BlockIndex} from "../../../libs/o-os/blockIndex";

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
  const circlesAccount = new CirclesAccount(safeState.mySafeAddress);

  safeState.myKnownTokens.subscribe(async tokenList =>
  {
    const newTokens = Object.values(tokenList).filter(o => !myTransactions[o.tokenAddress]);
    if (newTokens.length == 0)
    {
      return;
    }

    newTokens.forEach(newToken =>
    {
      const tokenTransactions = newToken.subscribeToTransactions();
      tokenTransactions.subscribe(inTransactionEvent =>
      {
        indexTransaction(newToken, inTransactionEvent);
        updateTrigger.trigger();
      });
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
