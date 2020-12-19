import {BehaviorSubject} from "rxjs";
import {CirclesBalance, OmoSafeState} from "../manifest";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {BN} from "ethereumjs-util";
import {config} from "../../../libs/o-circles-protocol/config";

export async function initMyBalances()
{
  const myCirclesBalancesSubject: BehaviorSubject<CirclesBalance[]> = new BehaviorSubject<CirclesBalance[]>([]);

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const web3 = config.getCurrent().web3();

  safeState.myTransactions.subscribe(transactions =>
  {
    const amounts = transactions.map(o => {
      return {
        token: o.token,
        amount: o.direction == "out" ? o.amount.neg() : o.amount
      };
    });

    amounts.reverse();

    const balances = amounts.reduce((p,c) => {
      if (!p[c.token])
      {
        p[c.token] = new BN("0");
      }
      p[c.token] = p[c.token].add(c.amount)
      return p;
    }, {});

    const readableBalances = Object.keys(balances).map(key => {
      return {
        token: key,
        balance: web3.utils.fromWei(balances[key])
      }
    })
    console.log("My circles balances:", readableBalances);
  });

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myBalances: myCirclesBalancesSubject
    }
  });
}
