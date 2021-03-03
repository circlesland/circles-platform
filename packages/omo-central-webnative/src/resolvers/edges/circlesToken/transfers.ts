import {CirclesToken, CirclesTokenTransferPredicate} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";
import {CirclesTokenTransfer} from "omo-central-interfaces/dist/types";

export function tokenTransfersResolver(wnfs:WnfsClient) {
    return async (parent: CirclesToken, args: any, context: Context) => {
        const token = await wnfs.circlesToken.findUnique({
            where: {
                address: parent.address
            },
            include: {
                transfers: true
            }
        });
        if (!token) {
            throw new Error(`Couldn't find a token with the address ${parent.address}`);
        }
        return token.transfers;
    };
}