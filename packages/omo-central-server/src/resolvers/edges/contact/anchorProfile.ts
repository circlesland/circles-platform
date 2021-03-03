import {PrismaClient} from "@prisma/client";
import {Contact} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function contactAnchorProfile(prisma:PrismaClient) {
    return async (parent:Contact, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        const contact = await prisma.contact.findUnique({
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