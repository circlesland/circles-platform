import {BN} from "ethereumjs-util";
import {UnTrustContext} from "../unTrust";

export const unTrustService = async (context:UnTrustContext) => {
    return await context.environment.eth.contracts.hub.setTrust(
        context.environment.me.myKey.privateKey,
        context.environment.me.mySafe,
        context.data.trustReceiver.value,
        new BN(0)
    );
}
