import {TransferXDaiContext} from "../transferXDai";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {BN} from "ethereumjs-util";

export const transferXDaiService = async (context:TransferXDaiContext) => {
    return await context.environment.safe.transferEth(
      context.environment.account,
      new BN(config.getCurrent().web3().utils.toWei(context.data.value.value.toString(), "ether")),
      context.data.recipient.value);
}
