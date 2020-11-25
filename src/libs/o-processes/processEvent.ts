import { BN } from "ethereumjs-util";
import { Address } from "src/libs/o-circles-protocol/interfaces/address";

/*
export type PromptField = {
    type: "ethereumAddress"|"wei"|"bytestring"|"percent"|"string"|"text",
    icon?: string,
    label: string,
    description?: string,
    triggers?: string,
    value?:  any
};

export type ProcessEvent =
    | { type: "omo.trigger" }
    | { type: "omo.stop" }
    | { type: "omo.back" }
    | { type: "omo.continue", message?: string }
    | { type: "omo.notification", message: string }
    | { type: "omo.cancel", message: string }
    | {
        // Prompts the user to take an action on the given fields.
        // Some fields (button types etc.) can link to a 'trigger'.
        // Triggers are declared outside of the fields to allow them
        // to access all fields.
        type: "omo.prompt",
        message?: string,
        data: {
            id: string,
            fields: {
                [id: string]: PromptField
            },
            trigger?: {
                // Save/Delete/..
                [id: string]: () => ProcessEvent
            }
        }
    }
    | {
        type: "omo.answer",
        message?: string,
        data: {
            id: string,
            fields: {
                [id: string]: PromptField
            }
        }
    }
    | { type: "omo.error", message: string }
    | {
        type: "omo.success",
        message: string,
        data?: {
            type: "transfer",
            blockNo: BN,
            from: Address,
            to: Address,
            value: BN
        } | {
            type: "ubi"
        } | {
            type: "trust",
            blockNo: BN,
            from: Address,
            to: Address,
            limit: number
        }
    }
    | { type: "omo.stopped" };
*/
