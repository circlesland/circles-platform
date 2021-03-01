import BN from "omo-quirks/dist/BN";
import { JumpstartContext } from "../processes/omo/jumpstart";
import { OmoSafeState } from "../manifest";
import { GnosisSafeProxy } from "omo-circles/dist/safe/gnosisSafeProxy";
import { tryGetDappState } from "omo-kernel/dist/kernel";

export const transferJumpstartXDaiService = async (context: JumpstartContext) => {
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const web3 = context.web3;
  const ownerAddress = web3.eth.accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

  return await gnosisSafeProxy.transferEth(
    safeState.myKey.privateKey,
    new BN(web3.utils.toWei((context.data.value.value).toString(), "ether")),
    context.data.recipient.value);
}
