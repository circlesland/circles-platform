import {MutationAddCirclesTrustRelationArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function addCirclesTrustRelationResolver(wnfs:WnfsClient) {
    return async (parent:any, args:MutationAddCirclesTrustRelationArgs, context:Context) => {
        const fissionName = await context.verifyJwt();
        const trustRelation = await wnfs.circlesTrustRelation.create({
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

        return trustRelation;
    };
}