import {Purchase} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function purchasedItem(wnfs:WnfsClient) {
    return async (parent:Purchase, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        const purchase = await wnfs.purchase.findUnique({
            where: {
                id: parent.id
            },
            include: {
                purchasedItem: true
            }
        });
        if (!purchase || purchase.purchasedByFissionName !== fissionName) {
            throw new Error(`Couldn't find a purchase with the id ${parent.id}`);
        }
        return {
            ...purchase.purchasedItem,
            publishedAt: purchase.purchasedItem.publishedAt.toJSON(),
            unlistedAt: purchase.purchasedItem.unlistedAt?.toJSON(),
            purchasedAt: purchase.purchasedItem.purchasedAt?.toJSON(),
        };
    };
}