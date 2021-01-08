import { send } from "xstate";
export const sendPrompt = (generateSpec) => {
    window.o.logger.log("Send prompt");
    const action = send((context) => {
        const spec = generateSpec(context);
        Object.keys(spec.artifacts)
            .filter(key => context.data[key] !== undefined)
            .forEach(key => spec.artifacts[key].value = context.data[key].value);
        return {
            title: spec.title ? spec.title : "",
            nextButtonTitle: spec.nextButtonTitle,
            hideNextButton: spec.hideNextButton,
            canGoBack: spec.canGoBack,
            type: "process.prompt",
            banner: spec.banner,
            data: spec.artifacts
        };
    });
    return action;
};
export const sendShellEvent = (shellEvent) => {
    const action = send((context) => {
        window.o.logger.log("Send shell event");
        return {
            type: "process.shellEvent",
            payload: shellEvent
        };
    });
    return action;
};
