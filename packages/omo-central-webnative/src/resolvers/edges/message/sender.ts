import {Message} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function messageSender(wnfs:WnfsClient) {
    return async (parent:Message, args:any, context:Context) => {
        const profile = await wnfs.profile.findUnique({
            where: {
                fissionName: parent.senderFissionName
            }
        });
        if (!profile) {
            throw new Error(`Couldn't find a profile for fission name: ${parent.senderFissionName}`);
        }

        return profile;
    };
}