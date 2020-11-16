import {send} from "xstate";
import {ProcessContext} from "../../../libs/o-processes/processContext";

export const promptError = send((context: ProcessContext, event:any) =>
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
                    value: JSON.stringify(event.data)
                }
            }
        }
    }
})
