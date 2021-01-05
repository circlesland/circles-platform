import { BN } from "ethereumjs-util";
import {SendInviteCreditsContext} from "../processes/omo/sendInviteCredits";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";

export const sendInviteCreditsService = async (context: SendInviteCreditsContext) =>
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
  const ethAmount = new BN(web3.utils.toWei((context.data.value.value / 10).toString(), "ether"));
  return await gnosisSafeProxy.transferEth(
    safeState.myKey.privateKey,
    ethAmount,
    context.data.recipient.value);
}
