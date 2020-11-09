import {BN} from "ethereumjs-util";
import {Address} from "../libs/o-circles-protocol/interfaces/address";

export type ProcessEvent =
    | { type: "omo.trigger" }
    | { type: "omo.stop" }
    | { type: "omo.continue", message?: string }
    | { type: "omo.notification", message: string }
    | { type: "omo.cancel", message: string }
    | {
    // Prompts the user to take an action on the given fields.
    // Some fields (button types etc.) can link to a 'trigger'.
    // Triggers are declared outside of the fields to allow them
    // to access all fields.
        type: "omo.prompt",
        message: string,
        data: {
            fields: {
                [id: string]: {
                    type: string,
                    icon?: string,
                    label: string,
                    description?: string,
                    triggers?: string,
                    value?: string // Default value
                }
            },
            trigger?: {
                // Save/Delete/..
                [id: string]: () => ProcessEvent
            }
        }
      }
    | {
        type: "omo.answer",
        message: string,
        data: {
            fields: {
                id: string,
                value: string
            }[]
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
