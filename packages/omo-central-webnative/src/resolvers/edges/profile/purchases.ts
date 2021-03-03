import {Profile} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function profilePurchases(wnfs:WnfsClientInterface) {
    return async (parent:Profile, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        if (fissionName != parent.fissionName) {
            throw new Error(`Only the owner of a profile can access its purchases`);
        }
        const purchases = await wnfs.purchase.findMany({
            where: {
                purchasedByFissionName: parent.fissionName
            }
        });
        return <any[]>purchases;
    };
}