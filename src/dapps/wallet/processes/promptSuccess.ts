import {send} from "xstate";
import {SetTrustContext} from "./setTrust/setTrust";
import {ProcessContext} from "../../../libs/o-processes/processContext";

export const promptSuccess = send((context: ProcessContext, event:any) =>
{
    return {
        type: "omo.prompt",
        message: `Click 'Next' to close the dialog.`,
        data: {
            id: "success",
            fields: {
                "message": {
                    type: "text",
                    label: "Success:",
                    value: JSON.stringify(event.data)
                }
            }
        }
    }
})
