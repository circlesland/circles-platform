import {send} from "xstate";

export const promptAlreadyRequested = send({
    type: "omo.prompt",
    message: "You recently requested your UBI. You can send only one request every 12 hours.",
    data: {
        id: "ok",
        fields: {
        }
    }
})
