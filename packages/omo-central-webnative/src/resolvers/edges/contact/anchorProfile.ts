import {Contact} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function contactAnchorProfile(wnfs:WnfsClient) {
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
        if (!contact || contact.anchorProfileFissionName != fissionName) {
            throw new Error(`Couldn't find a contact with id ${parent.id}`);
        }
        return contact.anchorProfile;
    };
}