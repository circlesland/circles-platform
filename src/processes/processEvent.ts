import {BN} from "ethereumjs-util";
import {Address} from "../libs/o-circles-protocol/interfaces/address";

export type ProcessEvent =
    | { type: "omo.trigger" }
    | { type: "omo.stop" }
    | { type: "omo.message", message: string }
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
            type: "ubi",
            blockNo: BN,
            to: Address,
            value: BN
        } | {
            type: "trust",
            blockNo: BN,
            from: Address,
            to: Address,
            limit: number
        }
      }
    | { type: "omo.stopped" };
