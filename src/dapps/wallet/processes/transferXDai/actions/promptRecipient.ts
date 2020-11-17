import {send} from "xstate";
import {TransferXDaiContext} from "../transferXDai";

export const promptRecipient = send((context: TransferXDaiContext) =>
{
    return {
        type: "omo.prompt",
        message: "Please enter the recipient's address below and click 'Next'",
        data: {
            id: "recipient",
            fields: {
                "address": {
                    type: "ethereumAddress",
                    label: "Address",
                    value: context.transfer?.recipient?.data ?? ""
                }
            }
        }
    }
});
