import { SendInviteCreditsContext } from "../sendInviteCredits";
import { BN } from "ethereumjs-util";

export const transferInviteCredits = async (context: SendInviteCreditsContext) => {
  return await context.environment.me.mySafe.transferEth(
    context.environment.me.myKey.privateKey,
    new BN(context.environment.eth.web3.utils.toWei((context.data.value.value / 10).toString(), "ether")),
    context.data.recipient.value);
}
