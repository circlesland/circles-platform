import { send } from "xstate";
import Success from "../../../o-views/atoms/Success.svelte";
export const sendSuccessPrompt = send((context) => {
    return {
        nextButtonTitle: "Close",
        type: "process.prompt",
        banner: {
            component: Success,
            data: {
                text: context.result.success
            }
        },
        hideNextButton: true,
        data: {}
    };
});
