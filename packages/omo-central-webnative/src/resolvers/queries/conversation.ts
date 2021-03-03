import {QueryConversationArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function conversationResolver(wnfs:WnfsClientInterface) {
    return async (parent:any, args:QueryConversationArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const messages = await wnfs.message.findMany({
            where: args.query
        });
        return <any[]>messages;
    };
}