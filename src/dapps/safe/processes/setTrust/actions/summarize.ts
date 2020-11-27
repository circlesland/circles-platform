import { send } from "xstate";
import { SetTrustContext } from "../setTrust";
import { strings } from "../../../data/strings";


export const summarize = send((context: SetTrustContext) => {
    return {
        type: "omo.prompt",
        message: context.setTrust.trustLimit.data > 0
            ? strings.safe.processes.setTrust.trustConfirmation(context)
            : strings.safe.processes.setTrust.untrustConfirmation(context),
        data: {
            id: "confirmation",
            fields: {
                "trustReceiver": {
                    type: "ethereumAddress",
                    label: context.setTrust.trustLimit.data > 0 ? "Trust receiver" : "Untrust",
                    value: context.setTrust.trustReceiver
                }
            }
        }
    }
})
