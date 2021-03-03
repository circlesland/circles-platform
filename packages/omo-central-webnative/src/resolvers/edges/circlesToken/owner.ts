import {CirclesToken} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function ownerResolver(wnfs:WnfsClientInterface) {
    return async (parent: CirclesToken, args: any, context: Context) => {
        const token = await wnfs.circlesToken.findUnique({
            where: {
                address: parent.address
            },
            select: {
                owner: true
            }
        });
        if (!token) {
            throw new Error(`Couldn't find a token with the address ${parent.address}`);
        }
        if (!token.owner) {
            throw new Error(`Couldn't find the token-owner for token ${parent.address}`);
        }
        return token.owner;
    };
}