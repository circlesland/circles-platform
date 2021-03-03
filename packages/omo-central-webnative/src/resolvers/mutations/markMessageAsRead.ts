import {MutationMarkMessageAsReadArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {WnfsClientInterface} from "../../wnfsClientInterface";

export function markMessageAsReadResolver(wnfs:WnfsClientInterface) {
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