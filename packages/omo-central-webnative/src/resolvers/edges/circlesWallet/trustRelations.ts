import {CirclesWallet} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function trustRelationsResolver(wnfs:WnfsClientInterface) {
    return async (parent: CirclesWallet, args:any, context: Context) => {
        const subjectWallet = await wnfs.circlesWallet.findUnique({
            where: {
                address: parent.address
            },
            include: {
                trusts: {
                    include: {
                        subject: true,
                        object: true
                    }
                }
            }
        });
        if (!subjectWallet) {
            throw new Error(`Couldn't find a wallet with address ${parent.address}`);
        }
        return subjectWallet.trustRelations ?? [];
    };
}