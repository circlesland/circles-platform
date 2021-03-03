import {CirclesTokenTransfer} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function objectResolver(wnfs:WnfsClient) {
    return async (parent: CirclesTokenTransfer, args: any, context: Context) => {
        const transfer = await wnfs.circlesTokenTransfer.findUnique({
            where: {
                id: parent.id
            },
            include: {
                object: true
            }
        });
        if (!transfer) {
            throw new Error(`Couldn't find a circles transfer with id ${parent.id}`);
        }
        return transfer.object;
    };
}