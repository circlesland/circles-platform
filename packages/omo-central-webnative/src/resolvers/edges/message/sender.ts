import {Message} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function messageSender(wnfs:WnfsClientInterface) {
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