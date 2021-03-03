import {Purchase} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function purchasedBy(wnfs:WnfsClientInterface) {
    return async (parent:Purchase, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        const purchase = await wnfs.purchase.findUnique({
            where: {
                id: parent.id
            },
            include: {
                purchasedBy: true
            }
        });
        if (!purchase || purchase.purchasedBy.fissionName !== fissionName) {
            throw new Error(`Couldn't find a purchase with the id ${parent.id}`);
        }
        return purchase.purchasedBy;
    };
}