import {BehaviorSubject} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {BN} from "ethereumjs-util";
import {config} from "../../../libs/o-circles-protocol/config";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";
import {CirclesBalance} from "../../../libs/o-circles-protocol/queryModel/circlesAccount";
import {OmoSafeState} from "../manifest";

const myCirclesBalancesSubject: BehaviorSubject<CirclesBalance[]> = new BehaviorSubject<CirclesBalance[]>([]);
let circlesBalances: CirclesBalance[] = [];
const updateTrigger = new DelayedTrigger(30, async () => {
  myCirclesBalancesSubject.next(circlesBalances);
});

export async function initMyBalances()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const web3 = config.getCurrent().web3();

  safeState.myTransactions.subscribe(transactions =>
  {
    const amounts = transactions.map(o => {
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

    circlesBalances = Object.keys(balances).map(key => {
      const balance = balances[key];
      return <CirclesBalance>{
        tokenAddress: key,
        balance: web3.utils.fromWei(balance.balance),
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
