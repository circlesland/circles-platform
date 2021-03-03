import {MutationAddCirclesTokenTransferArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function addCirclesTokenTransferResolver(wnfs: WnfsClient) {
    return async (parent: any, args: MutationAddCirclesTokenTransferArgs, context: Context) => {
        const fissionName = await context.verifyJwt();
        const transfer = await wnfs.circlesTokenTransfer.create({
            data: {
                createdAt: new Date(args.data.createdAt),
                createdInBlockNo: args.data.createdInBlockNo,
                createdInBlockHash: args.data.createdInBlockHash,
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
                value: args.data.value
            },
            include: {
                subject: true,
                object: true
            }
        });

        return {
            ...transfer,
            createdAt: transfer.createdAt.toJSON(),
            predicate: args.data.predicate
        };
    };
}