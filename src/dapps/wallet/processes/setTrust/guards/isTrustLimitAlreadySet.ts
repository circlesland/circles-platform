import {SetTrustContext} from "../setTrust";

export const isTrustLimitAlreadySet = (ctx:SetTrustContext) => !!(ctx.setTrust?.trustLimit);
