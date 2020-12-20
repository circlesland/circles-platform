import {BehaviorSubject} from "rxjs";
import {CirclesBalance, OmoSafeState} from "../manifest";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {BN} from "ethereumjs-util";
import {config} from "../../../libs/o-circles-protocol/config";

export async function initMyBalances()
{
  const myCirclesBalancesSubject: BehaviorSubject<CirclesBalance[]> = new BehaviorSubject<CirclesBalance[]>([]);

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

    const circlesBalances = Object.keys(balances).map(key => {
      const balance = balances[key];
      return <CirclesBalance>{
        tokenAddress: key,
        balance: web3.utils.fromWei(balance.balance),
        lastBlockNo: balance.lastBlockNo
      }
    })
    console.log("My circles balances:", circlesBalances);
    myCirclesBalancesSubject.next(circlesBalances);
  });

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myBalances: myCirclesBalancesSubject
    }
  });
}
