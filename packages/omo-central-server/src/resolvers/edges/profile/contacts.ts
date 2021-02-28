import {PrismaClient} from "@prisma/client";
import {Profile} from "../../../types";
import {Context} from "../../../context";

export function profileContacts(prisma:PrismaClient) {
    return async (parent:Profile, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        if (fissionName != parent.fissionName) {
            throw new Error(`Only the owner of a profile can access its contacts`);
        }
        const contacts = await prisma.contact.findMany({
            where: {
                anchorProfileFissionName: parent.fissionName
            }
        });
        return contacts.map(o => {
            return {
                ...o,
                createdAt: o.createdAt.toJSON()
            }
        });
    };
}