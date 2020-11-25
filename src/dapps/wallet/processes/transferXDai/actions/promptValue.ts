import {send} from "xstate";
import {TransferXDaiContext} from "../transferXDai";
import {BN} from "ethereumjs-util";
// import {ProcessEvent} from "../../../../../libs/o-processes/processEvent";

export const promptValue = send((context: TransferXDaiContext) =>
{
    return {
        type: "omo.prompt",
        message: "Please enter the xDai value you want to transfer and click 'Next'",
        data: {
            id: "value",
            fields: {
                "value": {
                    type: "wei",
                    label: "Value",
                    value: new BN(context.transfer?.value?.data ?? "0")
                }
            }
        }
    }
});
