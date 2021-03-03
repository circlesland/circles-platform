import {PrismaClient} from "@prisma/client";
import {MutationUnlistOfferArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";

export function unlistOfferResolver(prisma:PrismaClient) {
    return async (parent:any, args:MutationUnlistOfferArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const result = await prisma.offer.updateMany({
            where: {
                id: args.offerId,
                createdByFissionName: fissionUsername
            },
            data: {
                unlistedAt: new Date()
            }
        });

        return result.count > 0;
    };
}