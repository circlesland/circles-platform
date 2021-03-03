import {MutationAddCirclesWalletArgs} from "../../types";
import {Context} from "../../context";
import {WnfsClient} from "../../wnfsClient";

export function addCirclesWalletResolver(wnfs:WnfsClient) {
    return async (parent:any, args:MutationAddCirclesWalletArgs, context:Context) => {
        await context.verifyJwt();
        const createArgs: any = {
            address: args.data.address
        };
        if (args.data.ownToken) {
            createArgs["ownToken"] = {
                connectOrCreate: {
                    where: {
                        address: args.data.ownToken.address
                    },
                    create: {
                        address: args.data.ownToken.address,
                        createdAt: new Date(args.data.ownToken.createdAt),
                        createdInBlockHash: args.data.ownToken.createdInBlockHash,
                        createdInBlockNo: args.data.ownToken.createdInBlockNo
                    }
                }
            };
        }

        const wallet = await wnfs.circlesWallet.create({
            data: createArgs
        });

        return wallet;
    };
}