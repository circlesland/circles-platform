import {CirclesWallet} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function tokensResolver(wnfs:WnfsClient) {
    return async (parent: CirclesWallet, args:any, context: Context) => {
        const subjectWallet = await wnfs.circlesWallet.findUnique({
            where: {
                address: parent.address
            },
            include: {
                tokens: true,
            }
        });
        if (!subjectWallet) {
            throw new Error(`Couldn't find a wallet with address ${parent.address}`);
        }
        return subjectWallet.tokens;
    };
}