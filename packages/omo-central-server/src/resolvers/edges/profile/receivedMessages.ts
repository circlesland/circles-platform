import {PrismaClient} from "@prisma/client";
import {Profile} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function profileReceivedMessages(prisma:PrismaClient) {
    return async (parent:Profile, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        if (fissionName != parent.fissionName) {
            throw new Error(`Only the owner of a profile can access its received messages`);
        }
        const messages = await prisma.message.findMany({
            where: {
                recipientFissionName: fissionName
            }
        });
        return <any[]>messages;
    };
}