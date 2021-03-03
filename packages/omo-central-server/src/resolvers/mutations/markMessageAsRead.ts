import {PrismaClient} from "@prisma/client";
import {MutationMarkMessageAsReadArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";

export function markMessageAsReadResolver(prisma:PrismaClient) {
    return async (parent:any, args:MutationMarkMessageAsReadArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const result = await prisma.message.updateMany({
            where: {
                id: args.messageId,
                recipientFissionName: fissionUsername
            },
            data: {
                readAt: new Date()
            }
        });
        return result.count > 0;
    };
}