import {send} from "xstate";
import {SetTrustContext} from "../setTrust";

export const summarize = send((context: SetTrustContext) =>
{
    return {
        type: "omo.prompt",
        message: context.setTrust.trustLimit.data > 0
            ? `Click 'Next' to add ${context.setTrust.trustReceiver.data} to your list of trusted persons.`
            : `Click 'Next' to remove ${context.setTrust.trustReceiver.data} from your list of trusted persons.`,
        data: {
            id: "confirmation",
            fields: {
                "trustReceiver": {
                    type: "ethereumAddress",
                    label: "Trust receiver",
                    value: context.setTrust.trustReceiver
                },
                "trustLimit": {
                    type: "percent",
                    label: "Trust limit (%)",
                    value: context.setTrust.trustLimit
                }
            }
        }
    }
})
