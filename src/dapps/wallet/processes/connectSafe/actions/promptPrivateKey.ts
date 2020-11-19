import { send } from "xstate";

export const promptPrivateKey = send({
    type: "omo.prompt",
    message: "Please enter the 24 word seed phrase of your circles account and click 'Next' (it will be stored in your browsers local storage and completly cleared again, once you logout)",
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
