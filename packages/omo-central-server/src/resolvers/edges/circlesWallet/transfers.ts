import {PrismaClient} from '@prisma/client'
import {CirclesTokenTransferPredicate, CirclesWallet} from "../../../types";
import {Context} from "../../../context";

export function walletTransfersResolver(prisma:PrismaClient) {
    return async (parent: CirclesWallet, args: any, context: Context) => {
        const token = await prisma.circlesWallet.findUnique({
            where: {
                address: parent.address
            },
            include: {
                transfers: true
            }
        });
        if (!token) {
            throw new Error(`Couldn't find a token with the address ${parent.address}`);
        }
        return token.transfers.map(transfer => {
            let predicate: CirclesTokenTransferPredicate;
            switch (transfer.predicate) {
                case "GIVING_TO":
                    predicate = CirclesTokenTransferPredicate.GivingTo;
                    break;
                case "RECEIVING_FROM":
                    predicate = CirclesTokenTransferPredicate.ReceivingFrom;
                    break;
            }
            return {
                ...transfer,
                createdAt: transfer.createdAt?.toJSON(),
                subject: {
                    address: transfer.subjectAddress
                },
                predicate: predicate,
                object: {
                    address: transfer.objectAddress
                }
            }
        });
    };
}