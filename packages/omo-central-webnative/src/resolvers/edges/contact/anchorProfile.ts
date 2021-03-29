import {Contact} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function contactAnchorProfile(wnfs:WnfsClientInterface) {
    return async (parent:Contact, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        const contact = await wnfs.contact.findUnique({
            where: {
                id: parent.id
            },
            include: {
                anchorProfile: true
            }
        });
        if (!contact || contact.anchorProfile?.fissionName != fissionName) {
            throw new Error(`Couldn't find a contact with id ${parent.id}`);
        }
        return contact.anchorProfile;
    };
}