import {MutationLockOfferArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function lockOfferResolver(wnfs:WnfsClient) {
    return async (parent:any, args:MutationLockOfferArgs, context:Context) => {
        throw new Error(`NotImplemented`)
    };
}