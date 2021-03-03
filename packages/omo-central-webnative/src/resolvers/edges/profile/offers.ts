import {Profile} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function profileOffers(wnfs:WnfsClientInterface) {
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