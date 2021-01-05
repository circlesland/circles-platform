import { BN } from "ethereumjs-util";
import {JumpstartContext} from "../processes/omo/jumpstart";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";

export const transferJumpstartXDaiService = async (context: JumpstartContext) =>
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const web3 = context.environment.eth.web3;
  const ownerAddress = web3.eth.accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

  return await gnosisSafeProxy.transferEth(
    safeState.myKey.privateKey,
    new BN(web3.utils.toWei((context.data.value.value / 10).toString(), "ether")),
    context.data.recipient.value);
}
