import {SetTrustContext} from "../setTrust";
import {TokenAndOwner} from "../../../../../libs/o-circles-protocol/model/person";
import {assign} from "xstate";

export const checkIfAlreadyTrusted = (context:SetTrustContext) => {
    const personsITrust = context.person.getPersonsITrust();
    const alreadyTrusted:TokenAndOwner = personsITrust[context.setTrust.trustReceiver.data];
    if (alreadyTrusted && alreadyTrusted.limit > 0) {
        assign((ctx:SetTrustContext) => {
            //ctx.setTrust. = true;
            return ctx;
        })
    }
}
