import { assign } from "xstate";
export const setError = assign((context, event) => {
    console.warn("A process encountered an error:", event);
    context.result = {
        error: event.data
    };
    return context;
});
