import {CirclesWallet} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function tokensResolver(wnfs:WnfsClientInterface) {
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
        return subjectWallet.tokens ?? [];
    };
}