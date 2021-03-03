import {MutationProvePaymentArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function provePaymentResolver(wnfs:WnfsClientInterface) {
    return async (parent:any, args:MutationProvePaymentArgs, context:Context) => {
        throw new Error(`NotImplemented`)
    };
}