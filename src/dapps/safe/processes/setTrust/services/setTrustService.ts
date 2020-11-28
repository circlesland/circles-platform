import {BN} from "ethereumjs-util";
import {SetTrustContext} from "../setTrust";

export const setTrustService = async (context:SetTrustContext) => {
    return await context.environment.person.circlesHub.setTrust(
        context.environment.account,
        context.environment.safe,
        context.data.trustReceiver.value,
        new BN(100)
    );
}
