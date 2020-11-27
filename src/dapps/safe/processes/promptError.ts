import {send} from "xstate";
import {ProcessContext} from "../../../libs/o-processes/processContext";

export const promptError = send((context: ProcessContext) =>
{
    return {
        type: "omo.prompt",
        message: context.error,
        data: {
            id: "error",
            fields: {
            }
        }
    }
})
