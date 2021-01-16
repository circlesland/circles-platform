import {ProcessContext} from "../../../libs/o-processes/interfaces/processContext";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";
import {CirclesAccount} from "../../../libs/o-circles-protocol/model/circlesAccount";
import {BeginSignal, EndSignal, ProgressSignal} from "../../../libs/o-circles-protocol/interfaces/blockchainEvent";

export const requestUbiService = async (context: ProcessContext) =>
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let currentTransactionsList = safeState.myTransactions.getValue();
  safeState.myTransactions.next({
    signal: new ProgressSignal("requestUbi", "Harvesting time", 0),
    payload: currentTransactionsList.payload
  });

  const web3 = context.environment.eth.web3;
  const ownerAddress = context.environment.eth.web3
    .eth
    .accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);
  const circlesAccount = new CirclesAccount(safeState.mySafeAddress);
  const result = await circlesAccount.getUBI(safeState.myKey.privateKey, gnosisSafeProxy);

  currentTransactionsList = safeState.myTransactions.getValue();
  safeState.myTransactions.next({
    signal: new EndSignal("requestUbi"),
    payload: currentTransactionsList.payload
  });

  return result;
}
