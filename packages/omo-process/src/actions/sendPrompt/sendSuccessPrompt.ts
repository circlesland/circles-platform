import {sendPrompt} from "./sendPrompt";

export const sendSuccessPrompt = (component:object) => sendPrompt(
  (context) => {
    return {
      canGoBack: true,
      nextButtonTitle: "Close",
      banner: {
        component: component,
        data: {
          text: context.result?.success
        }
      },
      artifacts: {
      }
    }
  });
