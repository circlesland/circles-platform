import {CirclesToken} from "../../../types";
import {Context} from "../../../context";
import {PrismaClient} from '@prisma/client'

export function ownerResolver(prisma:PrismaClient) {
    return async (parent: CirclesToken, args: any, context: Context) => {
        const token = await prisma.circlesToken.findUnique({
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