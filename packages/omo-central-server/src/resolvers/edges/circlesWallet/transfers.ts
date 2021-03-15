import { PrismaClient } from "@prisma/client";
import {CirclesTokenTransferPredicate, CirclesWallet} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function walletTransfersResolver(prisma:PrismaClient) {
    return async (parent: CirclesWallet, args: any, context: Context) => {
        const wallet = await prisma.circlesWallet.findUnique({
            where: {
                address: parent.address
            },
            include: {
                knwonTokens: {
                    include: {
                        token: {
                            include: {
                                transfers: true
                            }
                        }
                    }
                }
            }
        });
        if (!wallet) {
            throw new Error(`Couldn't find a token with the address ${parent.address}`);
        }

        const walletTransfers = wallet.knwonTokens.map(knownToken => knownToken.token.transfers).reduce((p,c) => p.concat(c), []);

        return walletTransfers.map(transfer => {
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