import {MutationLockOfferArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function lockOfferResolver(wnfs:WnfsClientInterface) {
    return async (parent:any, args:MutationLockOfferArgs, context:Context) => {
        throw new Error(`NotImplemented`)
    };
}