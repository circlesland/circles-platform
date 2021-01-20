import BN from "omo-quirks/dist/BN";
import {SetTrustContext} from "../processes/circles/setTrust";
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {OmoSafeState} from "../manifest";

export const setTrustService = async (context: SetTrustContext) =>
{
  const web3 = context.web3;
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const ownerAddress = context.web3
    .eth
    .accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

  return await context.circlesHub.setTrust(
    safeState.myKey.privateKey,
    gnosisSafeProxy,
    context.data.trustReceiver.value,
    new BN(100)
  );
}
