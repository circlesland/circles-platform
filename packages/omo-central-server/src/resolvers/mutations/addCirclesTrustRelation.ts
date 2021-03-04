import {PrismaClient} from '@prisma/client'
import {CirclesTrustRelationPredicate, MutationAddCirclesTrustRelationArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";

export function addCirclesTrustRelationResolver(prisma:PrismaClient) {
    return async (parent:any, args:MutationAddCirclesTrustRelationArgs, context:Context) => {
        const fissionName = await context.verifyJwt();
        const trustRelation = await prisma.circlesTrustRelation.create({
            data: {
                createdAt: new Date(args.data.createdAt),
                createdInBlockHash: args.data.createdInBlockHash,
                createdInBlockNo: args.data.createdInBlockNo,
                subject: {
                    connectOrCreate: {
                        where: {
                            address: args.data.subjectAddress
                        },
                        create: {
                            address: args.data.subjectAddress,
                            addedAt: new Date(),
                            addedByFissionName: fissionName
                        }
                    }
                },
                predicate: args.data.predicate,
                object: {
                    connectOrCreate: {
                        where: {
                            address: args.data.objectAddress
                        },
                        create: {
                            address: args.data.objectAddress,
                            addedAt: new Date(),
                            addedByFissionName: fissionName
                        }
                    }
                },
                weight: args.data.weight
            },
            include: {
                subject: true,
                object: true
            }
        });
        let predicate: CirclesTrustRelationPredicate;
        switch (trustRelation.predicate) {
            case "RECEIVING_FROM":
                predicate = CirclesTrustRelationPredicate.ReceivingFrom;
                break;
            case "GIVING_TO":
                predicate = CirclesTrustRelationPredicate.GivingTo;
                break;
            default:
                throw new Error(`Unknown trust relation predicate: ${trustRelation.predicate}`)
        }
        return {
            ...trustRelation,
            predicate: predicate,
            createdAt: trustRelation.createdAt.toJSON()
        };
    };
}