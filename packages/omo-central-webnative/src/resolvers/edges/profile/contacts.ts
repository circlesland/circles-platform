import {Profile} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function profileContacts(wnfs:WnfsClientInterface) {
    return async (parent:Profile, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        if (fissionName != parent.fissionName) {
            throw new Error(`Only the owner of a profile can access its contacts`);
        }
        const contacts = await wnfs.contact.findMany({
            where: {
                anchorProfileFissionName: parent.fissionName
            }
        });
        return contacts;
    };
}