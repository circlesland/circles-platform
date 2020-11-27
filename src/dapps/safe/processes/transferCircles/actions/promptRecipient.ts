import {send} from "xstate";

export const promptRecipient = send({
    type: "omo.prompt",
    message: "Please enter the recipient's address below and click 'Next'",
    data: {
        id: "recipient",
        fields: {
            "address": {
                type: "ethereumAddress",
                label: "Address"
            }
        }
    }
})
