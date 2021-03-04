import {PrismaClient} from '@prisma/client'
import {CirclesTrustRelation} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function objectResolver(prisma:PrismaClient) {
    return async (parent: CirclesTrustRelation, args: any, context: Context) => {
        const trustRelation = await prisma.circlesTrustRelation.findUnique({
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