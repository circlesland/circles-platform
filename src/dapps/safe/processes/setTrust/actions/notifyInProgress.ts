import { send } from "xstate";
import { SetTrustContext } from "../setTrust";
import { strings } from "../../../data/strings";



export const notifyInProgress = send((context: SetTrustContext) => {
    return {
        type: "omo.notification",
        message: strings.safe.processes.setTrust.setTrustProgress(context)
    }
})
