import {PrismaClient} from "@prisma/client";
import {Profile} from "../../../types";
import {Context} from "../../../context";

export function profileSentMessages(prisma:PrismaClient) {
    return async (parent:Profile, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        if (fissionName != parent.fissionName) {
            throw new Error(`Only the owner of a profile can access its sent messages`);
        }
        const messages = await prisma.message.findMany({
            where: {
                senderFissionName: fissionName
            }
        });
        return <any[]>messages;
    };
}