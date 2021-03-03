import {QueryConversationArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function conversationResolver(wnfs:WnfsClient) {
    return async (parent:any, args:QueryConversationArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const messages = await wnfs.message.findMany({
            where: args.query
        });
        return <any[]>messages;
    };
}