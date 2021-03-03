import {CirclesWallet} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function walletTransfersResolver(wnfs:WnfsClient) {
    return async (parent: CirclesWallet, args: any, context: Context) => {
        const token = await wnfs.circlesWallet.findUnique({
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