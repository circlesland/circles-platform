import {PrismaClient, CirclesTokenTransfer} from '@prisma/client'
import {CirclesToken, CirclesTokenTransferPredicate} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function tokenTransfersResolver(prisma:PrismaClient) {
    return async (parent: CirclesToken, args: any, context: Context) => {
        const token = await prisma.circlesToken.findUnique({
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
        return token.transfers.map((transfer:CirclesTokenTransfer) => {
            let predicate: CirclesTokenTransferPredicate;
            switch (transfer.predicate) {
                case "GIVING_TO":
                    predicate = CirclesTokenTransferPredicate.GivingTo;
                    break;
                case "RECEIVING_FROM":
                    predicate = CirclesTokenTransferPredicate.ReceivingFrom;
                    break;
                default:
                    throw new Error(`Unknown predicate: ${transfer.predicate}`);
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