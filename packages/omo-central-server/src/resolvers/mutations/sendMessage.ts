import {MutationSendMessageArgs} from "../../types";
import {Context} from "../../context";
import {PrismaClient} from "@prisma/client/scripts/default-index";
import {EventBroker} from "omo-utils/dist/eventBroker";

export function sendMessageResolver(prisma:PrismaClient, eventBroker:EventBroker) {
    return async (parent:any, args:MutationSendMessageArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const message = await prisma.message.create({
            data: {
                senderFissionName: fissionUsername,
                createdAt: new Date(),
                recipientFissionName: args.data.toFissionName,
                topic: args.data.topic,
                type: args.data.type,
                content: args.data.content
            }
        });
        let topic = eventBroker.tryGetTopic(args.data.toFissionName, "messages");
        if (topic) {
            topic.publish(message);
        }
        return <any>{
            ...message,
            createdAt: message.createdAt.toJSON(),
            readAt: message.readAt?.toJSON()
        };
    };
}