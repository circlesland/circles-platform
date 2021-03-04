import {PrismaClient, Contact} from "@prisma/client";
import {QueryContactsArgs} from "omo-central-interfaces/dist/types";
import {whereProfile} from "./profiles";

export function contactsResolver(prisma:PrismaClient) {
    return async (parent:any, args:QueryContactsArgs) => {
        const q = whereProfile(args);
        const result = await prisma.profile.findUnique({
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
        return result.contacts.map((o:Contact) => {
            return {
                ...o,
                createdAt: o.createdAt.toJSON()
            }
        });
    };
}