import {send} from "xstate";
import {ProcessContext} from "../../../libs/o-processes/processContext";

export const promptError = send((context: ProcessContext) =>
{
    return {
        type: "omo.prompt",
        message: `Click 'Next' to close the dialog.`,
        data: {
            id: "error",
            fields: {
                "message": {
                    type: "text",
                    label: "Error",
                    value: JSON.stringify(context.error)
                }
            }
        }
    }
})
