import {MutationAddCirclesTokenArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function addCirclesTokenResolver(wnfs:WnfsClient) {
    return async (parent:any, args:MutationAddCirclesTokenArgs, context:Context) => {
        const fissionName = await context.verifyJwt();
        const createArgs: any = {
            address: args.data.address,
            createdAt: new Date(args.data.createdAt),
            createdInBlockNo: args.data.createdInBlockNo,
            createdInBlockHash: args.data.createdInBlockHash,
        };
        if (args.data.owner) {
            createArgs["owner"] = {
                connectOrCreate: {
                    where: {
                        address: args.data.owner.address
                    },
                    data: {
                        address: args.data.owner.address,
                        addedAt: new Date(),
                        addedByFissionName: fissionName
                    }
                }
            };
        }
        const token = await wnfs.circlesToken.create({
            data: createArgs
        });

        return token;
    };
}