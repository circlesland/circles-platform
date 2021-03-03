import {MutationUnlistOfferArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function unlistOfferResolver(wnfs:WnfsClient) {
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