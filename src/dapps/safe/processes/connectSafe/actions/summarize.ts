import {send} from "xstate";
import {ConnectSafeContext} from "../connectSafe";

export const summarize = send((context:ConnectSafeContext) =>
{
    return {
        type: "omo.prompt",
        message: "Press 'Next' to confirm the values and connect your safe.",
        data: {
            id: "connectSafe",
            fields: {
                "safeOwnerAddress": {
                    isReadonly: true,
                    type: "ethereumAddress",
                    label: "Safe owner address",
                    value: context.connectSafe.safeOwnerAddress
                },
                "safeAddress": {
                    isReadonly: true,
                    type: "ethereumAddress",
                    label: "Safe address",
                    value: context.connectSafe.safeAddress
                }
            }
        }
    }
})
