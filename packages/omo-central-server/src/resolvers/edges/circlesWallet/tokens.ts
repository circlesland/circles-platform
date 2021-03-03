import {PrismaClient} from '@prisma/client'
import {CirclesWallet} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function tokensResolver(prisma:PrismaClient) {
    return async (parent: CirclesWallet, args:any, context: Context) => {
        const subjectWallet = await prisma.circlesWallet.findUnique({
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
        return subjectWallet.tokens.map(token => {
            return {
                ...token,
                createdAt: token.createdAt.toJSON()
            }
        });
    };
}