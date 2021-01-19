import {ProgressSignal} from "omo-events/dist/signals/progressSignal";
import {RequestUbiContext} from "../processes/circles/requestUbi";
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {EndSignal} from "omo-events/dist/signals/endSignal";

export const requestUbiService = async (context: RequestUbiContext) =>
{
  let currentTransactionsList = context.safeState.myTransactions.getValue();
  context.safeState.myTransactions.next({
    signal: new ProgressSignal("Harvesting time", 0),
    payload: currentTransactionsList.payload
  });

  const web3 = context.web3;
  const ownerAddress = context.web3
    .eth
    .accounts
    .privateKeyToAccount(context.safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, context.safeState.mySafeAddress);
  const circlesAccount = new CirclesAccount(context.safeState.mySafeAddress);
  const result = await circlesAccount.getUBI(context.safeState.myKey.privateKey, gnosisSafeProxy);

  currentTransactionsList = context.safeState.myTransactions.getValue();
  context.safeState.myTransactions.next({
    signal: new EndSignal(),
    payload: currentTransactionsList.payload
  });

  return result;
}
