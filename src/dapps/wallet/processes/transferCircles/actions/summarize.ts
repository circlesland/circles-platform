import {send} from "xstate";
import {TransferCirclesContext} from "../transferCircles";

export const summarize = send((context: TransferCirclesContext) =>
{
    return {
        type: "omo.prompt",
        message: "Click 'Next' to confirm the transaction.",
        data: {
            id: "confirmation",
            fields: {
                "value": {
                    type: "wei",
                    label: "Value",
                    value: context.transfer.value
                },
                "recipient": {
                    type: "ethereumAddress",
                    label: "To",
                    value: context.transfer.recipient
                }
            }
        }
    }
})
