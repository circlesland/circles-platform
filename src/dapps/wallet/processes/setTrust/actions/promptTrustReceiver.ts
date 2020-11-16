import {send} from "xstate";

export const promptTrustReceiver = send({
    type: "omo.prompt",
    message: "Please enter the address of the person you want to trust and click 'Next'",
    data: {
        id: "setTrust",
        fields: {
            "trustReceiver": {
                type: "ethereumAddress",
                label: "Address"
            }
        }
    }
})
