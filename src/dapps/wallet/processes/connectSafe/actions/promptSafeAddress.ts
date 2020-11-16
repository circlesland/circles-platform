import {send} from "xstate";

export const promptSafeAddress = send({
    type: "omo.prompt",
    message: "Please enter the address of your safe below and click 'Next'",
    data: {
        id: "connectSafe",
        fields: {
            "safeAddress": {
                type: "ethereumAddress",
                label: "Safe address"
            }
        }
    }
})
