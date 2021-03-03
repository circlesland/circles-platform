import {Offer} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function offerCreatedBy(wnfs:WnfsClient) {
    return async (parent:Offer, args:any, context:Context) => {
        const profile = await wnfs.profile.findUnique({
            where: {
                fissionName: parent.createdByFissionName
            }
        });
        if (!profile) {
            throw new Error(`Couldn't find the creator profile for offer ${parent.id}`);
        }
        return profile;
    };
}