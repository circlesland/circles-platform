import {CirclesWallet} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function walletTransfersResolver(wnfs:WnfsClientInterface) {
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
        return token.transfers ?? [];
    };
}