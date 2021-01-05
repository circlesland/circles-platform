import { assign } from "xstate";
export const setResult = (message) => {
    const action = assign((context, event) => {
        context.result = {
            success: message ? message(context) : event
        };
        return context;
    });
    return action;
};
