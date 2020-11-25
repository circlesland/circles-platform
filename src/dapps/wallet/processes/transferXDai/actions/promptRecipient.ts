import {send} from "xstate";
import {Prompt} from "../../../../../libs/o-events/prompt";
import {ProcessContext} from "../../../../../libs/o-processes/processContext";

export const promptRecipient = send((context: ProcessContext) =>
{
  return <Prompt> {
    type: "omo.prompt",
    fields: [{
      type: "title",
      data: "Please enter the recipient's address below and click 'Next'"
    },{
      key: "recipient",
      type: "ethereumAddress",
      required: true,
      label: "Address",
    }]
  };
});
