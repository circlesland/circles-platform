import { BN } from "ethereumjs-util";
import {SendInviteCreditsContext} from "../processes/omo/sendInviteCredits";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";

export const sendInviteCreditsService = async (context: SendInviteCreditsContext) =>
{
  const web3 = context.web3;
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const ownerAddress = context.web3
    .eth
    .accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(context.web3, ownerAddress, safeState.mySafeAddress);
  const ethAmount = new BN(web3.utils.toWei((context.data.value.value / 100).toString(), "ether"));
  return await gnosisSafeProxy.transferEth(
    safeState.myKey.privateKey,
    ethAmount,
    context.data.recipient.value);
}
