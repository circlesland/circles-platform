import {MutationSendMessageArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {EventBroker} from "omo-utils/dist/eventBroker";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function sendMessageResolver(wnfs:WnfsClientInterface, eventBroker:EventBroker) {
    return async (parent:any, args:MutationSendMessageArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const message = await wnfs.message.create({
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
        return message;
    };
}