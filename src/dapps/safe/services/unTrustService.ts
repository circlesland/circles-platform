import { BN } from "ethereumjs-util";
import {UnTrustContext} from "../processes/circles/unTrust";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";

export const unTrustService = async (context: UnTrustContext) =>
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState.fission) {
    throw new Error("You're not authenticated");
  }

  const web3 = context.environment.eth.web3;
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const ownerAddress = context.environment.eth.web3
    .eth
    .accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

  return await context.environment.eth.contracts.hub.setTrust(
    safeState.myKey.privateKey,
    gnosisSafeProxy,
    context.data.trustReceiver.value,
    new BN(0)
  );
}
