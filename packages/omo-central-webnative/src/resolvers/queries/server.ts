import {serverDid} from "../../consts";
import {Maybe, Resolver, ResolversParentTypes, ResolversTypes} from "../../types";

export const serverResolver:Resolver<Maybe<ResolversTypes['Omo']>, ResolversParentTypes['Query'], any> = parent => {
    return {
        did: serverDid
    }
}