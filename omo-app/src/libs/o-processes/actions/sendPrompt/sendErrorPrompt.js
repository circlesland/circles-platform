import { send } from "xstate";
import Error from "../../../o-views/atoms/Error.svelte";
export const sendErrorPrompt = send((context) => {
    return {
        nextButtonTitle: "Close",
        type: "process.prompt",
        banner: {
            component: Error,
            data: {
                error: context.result.error
            }
        },
        data: {}
    };
});
