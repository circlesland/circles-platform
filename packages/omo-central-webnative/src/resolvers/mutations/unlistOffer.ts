import {MutationUnlistOfferArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function unlistOfferResolver(wnfs:WnfsClientInterface) {
    return async (parent:any, args:MutationUnlistOfferArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const result = await wnfs.offer.updateMany({
            where: {
                id: args.offerId,
                createdByFissionName: fissionUsername
            },
            data: {
                unlistedAt: new Date()
            }
        });

        return result.length > 0;
    };
}