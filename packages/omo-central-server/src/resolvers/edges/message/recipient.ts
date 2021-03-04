import {PrismaClient} from "@prisma/client";
import {Message} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function messageRecipient(prisma:PrismaClient) {
    return async (parent:Message, args:any, context:Context) => {
        const profile = await prisma.profile.findUnique({
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