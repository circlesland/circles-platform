import {BehaviorSubject} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {BN} from "ethereumjs-util";
import {OmoSafeState} from "../manifest";
import {DelayedTrigger} from "omo-utils/dist/delayedTrigger";
import {Envelope} from "omo-kernel-interfaces/dist/envelope";
import {CirclesBalance} from "omo-models/dist/omo/circlesBalance";

const myCirclesBalancesSubject: BehaviorSubject<Envelope<CirclesBalance[]>> = new BehaviorSubject<Envelope<CirclesBalance[]>>({
  payload: []
});
let myBalances: CirclesBalance[] = [];
const updateTrigger = new DelayedTrigger(30, async () => {
  const current = myCirclesBalancesSubject.getValue();
  myCirclesBalancesSubject.next({
    signal: current?.signal,
    payload: myBalances
  });
});

export async function initMyBalances()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  safeState.myTransactions.subscribe(transactions =>
  {
    const amounts = transactions.payload.map(o => {
      return {
        token: o.token,
        amount: o.direction == "out" ? o.amount.neg() : o.amount,
        blockNo: o.blockNo
      };
    });

    amounts.reverse();

    const balances = amounts.reduce((p,c) => {
      if (!p[c.token])
      {
        p[c.token] = {
          balance: new BN("0"),
          lastBlockNo: 0
        };
      }
      p[c.token] = {
        balance: p[c.token].balance.add(c.amount),
        lastBlockNo: p[c.token].lastBlockNo < c.blockNo ? c.blockNo : p[c.token].lastBlockNo
      }
      return p;
    }, {});

    myBalances = Object.keys(balances).map(key => {
      const balance = balances[key];
      return <CirclesBalance>{
        tokenAddress: key,
        balance: balance.balance,
        lastBlockNo: balance.lastBlockNo
      }
    });
    updateTrigger.trigger();
  });

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myBalances: myCirclesBalancesSubject
    }
  });
}
