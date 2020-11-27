import {send} from "xstate";
import {SetTrustContext} from "./setTrust/setTrust";
import {ProcessContext} from "../../../libs/o-processes/processContext";

export const promptSuccess = send((context: ProcessContext) =>
{
    return {
        type: "omo.prompt",
        message: context.result,
        data: {
            id: "success",
            fields: {
            }
        }
    }
})
