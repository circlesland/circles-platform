import { BN } from "ethereumjs-util";
import { SetTrustContext } from "../setTrust";

export const setTrustService = async (context: SetTrustContext) => {
  return await context.environment.eth.contracts.hub.setTrust(
    context.environment.me.myKey.privateKey,
    context.environment.me.mySafe,
    context.data.trustReceiver.value,
    new BN(100)
  );
}
