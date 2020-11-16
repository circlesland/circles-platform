import {BN} from "ethereumjs-util";
import {SetTrustContext} from "../setTrust";

export const setTrustService = async (context:SetTrustContext) => {
    return await context.person.circlesHub.setTrust(
        context.account,
        context.safe,
        context.setTrust.trustReceiver.data,
        new BN(context.setTrust.trustLimit.data)
    );
}
