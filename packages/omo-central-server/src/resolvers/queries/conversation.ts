import {PrismaClient} from "@prisma/client";
import {QueryConversationArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";

export function conversationResolver(prisma:PrismaClient) {
    return async (parent:any, args:QueryConversationArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const messages = await prisma.message.findMany({
            where: {
                OR: [{
                    recipientFissionName: args.query.withFissionName ?? undefined,
                    senderFissionName: fissionUsername
                }, {
                    recipientFissionName: fissionUsername,
                    senderFissionName: args.query.withFissionName ?? undefined
                }]
            }
        });
        return <any[]>messages;
    };
}