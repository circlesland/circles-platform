import {assign} from "xstate";
import {ConnectSafeContext} from "../connectSafe";

export const generateFundLink = assign((context: ConnectSafeContext, event) => {
  context.data.fundLink = {
    type: "string",
    key: "fundLink",
    value: "http://localhost:5000/#/safe/answerInviteRequest/" + context.environment.me.myAddress
  };
  return context;
});
