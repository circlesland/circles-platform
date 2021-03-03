import {Profile} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function profilePurchases(wnfs:WnfsClient) {
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