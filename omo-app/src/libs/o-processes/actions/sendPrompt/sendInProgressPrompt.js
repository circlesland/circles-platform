import { send } from "xstate";
import Progress from "../../../o-views/atoms/Progress.svelte";
export const sendInProgressPrompt = (message) => send((context) => {
    return {
        hideNextButton: true,
        type: "process.prompt",
        banner: {
            component: Progress,
            data: {
                text: message ? message(context) : undefined
            }
        },
        data: {}
    };
});
