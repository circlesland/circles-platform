import BN from "omo-quirks/dist/BN";
import {UnTrustContext} from "../processes/circles/unTrust";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {tryGetDappState} from "omo-kernel/dist/kernel";

export const unTrustService = async (context: UnTrustContext) =>
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
    new BN(0)
  );
}
