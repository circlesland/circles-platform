import {assign} from "xstate";
import {CreateSafeContext} from "../createSafe";

export const generateFundLink = assign((context: CreateSafeContext, event) => {
  context.data.fundLink = {
    type: "string",
    key: "fundLink",
    value: "http://go-fund-yourself/" + context.data.account.value.address
  };
  return context;
});
