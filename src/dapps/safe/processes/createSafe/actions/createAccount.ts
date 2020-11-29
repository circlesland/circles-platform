import {assign} from "xstate";
import {ProcessContext} from "../../../../../libs/o-processes/interfaces/processContext";
import {config} from "../../../../../libs/o-circles-protocol/config";

export const createAccount = assign((context: ProcessContext, event) => {
  context.data.account = {
    type: "ethereumAccount",
    key: "account",
    value: config.getCurrent().web3().eth.accounts.create()
  };
  return context;
});
