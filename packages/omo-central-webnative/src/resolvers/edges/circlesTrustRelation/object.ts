import {CirclesTrustRelation} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function objectResolver(wnfs:WnfsClient) {
    return async (parent: CirclesTrustRelation, args: any, context: Context) => {
        const trustRelation = await wnfs.circlesTrustRelation.findUnique({
            where: {
                id: parent.id
            },
            include: {
                object: true
            }
        });
        if (!trustRelation) {
            throw new Error(`Couldn't find a trust relation with id ${parent.id}`);
        }
        return trustRelation.object;
    };
}