import {CirclesToken} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function ownerResolver(wnfs:WnfsClient) {
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
        return token.owner;
    };
}