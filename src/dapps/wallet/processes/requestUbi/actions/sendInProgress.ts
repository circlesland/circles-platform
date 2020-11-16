import {send} from "xstate";

export const sendInProgress = send({
    type: "omo.notification",
    message: "Requesting UBI .."
});
