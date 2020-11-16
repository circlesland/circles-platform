import {send} from "xstate";
import {SetTrustContext} from "../setTrust";
import {strings} from "../../../languages/strings";

export const notifyInProgress = send((context: SetTrustContext) =>
{
    return {
        type: "omo.notification",
        message: strings.wallet.processes.setTrust.setTrustProgress(context)
    }
})
