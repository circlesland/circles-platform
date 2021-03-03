import {MutationProvePaymentArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function provePaymentResolver(wnfs:WnfsClient) {
    return async (parent:any, args:MutationProvePaymentArgs, context:Context) => {
        throw new Error(`NotImplemented`)
    };
}