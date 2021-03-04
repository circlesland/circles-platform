import {PrismaClient} from '@prisma/client'
import {CirclesWallet} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function ownTokenResolver(prisma:PrismaClient) {
    return async (parent: CirclesWallet, args:any, context: Context) => {
        const subjectWallet = await prisma.circlesWallet.findUnique({
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
        return {
            ...subjectWallet.ownToken,
            createdAt: subjectWallet.ownToken.createdAt.toJSON()
        };
    };
}