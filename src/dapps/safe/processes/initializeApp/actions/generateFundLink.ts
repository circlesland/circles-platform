import {assign} from "xstate";
import {InitializeAppContext} from "../initializeApp";

export const generateFundLink = assign((context: InitializeAppContext, event) => {
  context.data.fundLink = {
    type: "string",
    key: "fundLink",
    value: window.location.origin + "#/safe/answerInviteRequest/" + context.environment.me.myAddress
  };
  return context;
});
