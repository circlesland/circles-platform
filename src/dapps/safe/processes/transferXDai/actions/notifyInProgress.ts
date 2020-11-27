import {send} from "xstate";

export const notifyInProgress = send({
    type: "omo.notification",
    message: "Transferring xDai .."
});
