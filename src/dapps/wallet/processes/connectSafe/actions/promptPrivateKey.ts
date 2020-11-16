import {send} from "xstate";

export const promptPrivateKey = send({
    type: "omo.prompt",
    message: "Please enter the private key of the safe owner account and click 'Next'",
    data: {
        id: "connectSafe",
        fields: {
            "safeOwnerPrivateKey": {
                type: "bytestring",
                label: "Safe owner private key"
            }
        }
    }
})
