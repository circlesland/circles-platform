import {QueryContactsArgs} from "omo-central-interfaces/dist/types";
import {whereProfile} from "./profiles";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function contactsResolver(wnfs:WnfsClientInterface) {
    return async (parent:any, args:QueryContactsArgs) => {
        const q = whereProfile(args);
        const result = await wnfs.profile.findUnique({
            where: {
                ...q
            },
            include: {
                contacts: {
                    include: {
                        contactProfile: true,
                    }
                }
            }
        });
        if (!result) {
            throw new Error(`Couldn't find a profile with query: ${JSON.stringify(q)}`)
        }
        return result.contacts ?? [];
    };
}