import {send} from "xstate";
import {TransferXDaiContext} from "../transferXDai";

export const summarize = send((context: TransferXDaiContext) =>
{
    return {
        type: "omo.prompt",
        message: "Click 'Next' to confirm the transaction",
        data: {
            id: "confirmation",
            fields: {
                "value": {
                    type: "wei",
                    isReadonly: true,
                    label: "Value",
                    value: context.transfer.value
                },
                "recipient": {
                    type: "ethereumAddress",
                    isReadonly: true,
                    label: "Recipient",
                    value: context.transfer.recipient
                }
            }
        }
    }
})
