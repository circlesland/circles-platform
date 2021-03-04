import {PrismaClient, CirclesTrustRelation} from '@prisma/client'
import {CirclesTrustRelationPredicate, CirclesWallet} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function trustRelationsResolver(prisma:PrismaClient) {
    return async (parent: CirclesWallet, args:any, context: Context) => {
        const subjectWallet = await prisma.circlesWallet.findUnique({
            where: {
                address: parent.address
            },
            include: {
                trustSubject: {
                    include: {
                        subject: true,
                        object: true
                    }
                },
                trustObject: {
                    include: {
                        subject: true,
                        object: true
                    }
                }
            }
        });
        if (!subjectWallet) {
            throw new Error(`Couldn't find a wallet with address ${parent.address}`);
        }

        const trusts = subjectWallet.trustSubject.concat(subjectWallet.trustObject);

        return trusts.map((trust:CirclesTrustRelation) => {
            let predicate: CirclesTrustRelationPredicate;
            switch (trust.predicate) {
                case "GIVING_TO":
                    predicate = CirclesTrustRelationPredicate.GivingTo;
                    break;
                case "RECEIVING_FROM":
                    predicate = CirclesTrustRelationPredicate.ReceivingFrom;
                    break;
            }
            return {
                ...trust,
                createdAt: trust.createdAt?.toJSON(),
                predicate: predicate
            }
        });
    };
}