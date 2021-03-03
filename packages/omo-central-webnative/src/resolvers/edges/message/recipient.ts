import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";
import {Message} from "omo-central-interfaces/dist/types";

export function messageRecipient(wnfs:WnfsClientInterface) {
    return async (parent:Message, args:any, context:Context) => {
        const profile = await wnfs.profile.findUnique({
            where: {
                fissionName: parent.recipientFissionName
            }
        });
        if (!profile) {
            throw new Error(`Couldn't find a profile for fission name: ${parent.senderFissionName}`);
        }

        return profile;
    };
}