import {SetTrustContext} from "../setTrust";

export const isTrustReceiverAlreadySet = (ctx:SetTrustContext) => !!ctx.setTrust.trustReceiver;
