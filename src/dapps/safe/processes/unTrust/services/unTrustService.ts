import {BN} from "ethereumjs-util";
import {UnTrustContext} from "../unTrust";

export const unTrustService = async (context:UnTrustContext) => {
    return await context.environment.person.circlesHub.setTrust(
        context.environment.account,
        context.environment.safe,
        context.data.trustReceiver.value,
        new BN(0)
    );
}
