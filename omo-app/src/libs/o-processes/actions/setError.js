import { assign } from "xstate";
export const setError = assign((context, event) => {
    window.o.logger.log("A process encountered an error:", event);
    context.result = {
        error: event.data
    };
    return context;
});
