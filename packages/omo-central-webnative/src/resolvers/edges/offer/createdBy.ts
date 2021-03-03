import {Offer} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function offerCreatedBy(wnfs:WnfsClientInterface) {
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