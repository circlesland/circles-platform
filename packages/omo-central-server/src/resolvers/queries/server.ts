import {serverDid} from "../../consts";
import {Maybe, Resolver, ResolversParentTypes, ResolversTypes} from "omo-central-interfaces/dist/types";

export const serverResolver:Resolver<Maybe<ResolversTypes['Omo']>, ResolversParentTypes['Query'], any> = parent => {
    return {
        did: serverDid,
        version: "0.0.4"
    }
}