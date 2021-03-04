import {PrismaClient} from "@prisma/client";
import {Message} from "../../../types";
import {Context} from "../../../context";

export function messageSender(prisma:PrismaClient) {
    return async (parent:Message, args:any, context:Context) => {
        const profile = await prisma.profile.findUnique({
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