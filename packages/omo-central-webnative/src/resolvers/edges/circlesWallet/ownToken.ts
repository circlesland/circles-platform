import {CirclesWallet} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function ownTokenResolver(wnfs:WnfsClient) {
    return async (parent: CirclesWallet, args:any, context: Context) => {
        const subjectWallet = await wnfs.circlesWallet.findUnique({
            where: {
                address: parent.address
            },
            include: {
                ownToken: true
            }
        });
        if (!subjectWallet) {
            throw new Error(`Couldn't find a token with address ${parent.address}.`)
        }
        if (!subjectWallet.ownToken) {
            return null;
        }
        return subjectWallet.ownToken;
    };
}