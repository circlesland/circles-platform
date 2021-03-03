import {Purchase} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function purchasedFrom(wnfs:WnfsClientInterface) {
    return async (parent:Purchase, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        const purchase = await wnfs.purchase.findUnique({
            where: {
                id: parent.id
            },
            include: {
                purchasedItem: {
                    include: {
                        createdBy: true
                    }
                }
            }
        });
        if (!purchase) {
            throw new Error(`Couldn't find a purchase with the id ${parent.id}`);
        }
        if (!purchase.purchasedItem?.createdBy) {
            throw new Error(`Couldn't find the creator of the purchased item (purchase: ${parent.id})`);
        }
        return purchase.purchasedItem.createdBy;
    };
}