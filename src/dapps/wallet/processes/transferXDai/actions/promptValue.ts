import {send} from "xstate";

export const promptValue = send({
    type: "omo.prompt",
    message: "Please enter the xDai value you want to transfer and click 'Next'",
    data: {
        id: "value",
        fields: {
            "value": {
                type: "wei",
                label: "Value"
            }
        }
    }
})
