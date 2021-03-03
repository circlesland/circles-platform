import {Profile} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function profileOffers(wnfs:WnfsClient) {
    return async (parent:Profile, args:any, context:Context) => {
        const offers = await wnfs.offer.findMany({
            where: {
                createdByFissionName: parent.fissionName,
                unlistedAt: null
            }
        });
        return <any[]>offers;
    };
}