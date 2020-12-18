import { BN } from "ethereumjs-util";
import {SetTrustContext} from "../processes/circles/setTrust";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";

export const setTrustService = async (context: SetTrustContext) =>
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const web3 = context.environment.eth.web3;
  const ownerAddress = web3.eth.accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

  return await context.environment.eth.contracts.hub.setTrust(
    safeState.myKey.privateKey,
    gnosisSafeProxy,
    context.data.trustReceiver.value,
    new BN(100)
  );
}
