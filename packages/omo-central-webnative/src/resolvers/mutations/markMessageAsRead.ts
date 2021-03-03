import {MutationMarkMessageAsReadArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function markMessageAsReadResolver(wnfs:WnfsClient) {
    return async (parent:any, args:MutationMarkMessageAsReadArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const result = await wnfs.message.updateMany({
            where: {
                id: args.messageId,
                recipientFissionName: fissionUsername
            },
            data: {
                readAt: new Date()
            }
        });
        return result.length > 0;
    };
}