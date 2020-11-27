import {send} from "xstate";

export const promptTrustLimit = send({
    type: "omo.prompt",
    message: "Please enter the trust limit in percent and click 'Next'",
    data: {
        id: "setTrust",
        fields: {
            "trustLimit": {
                type: "percent",
                label: "Trust limit %"
            }
        }
    }
})
