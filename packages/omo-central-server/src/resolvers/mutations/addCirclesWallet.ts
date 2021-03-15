import { PrismaClient } from "@prisma/client";
import {MutationAddCirclesWalletArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";

export function addCirclesWalletResolver(prisma:PrismaClient) {
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

        const wallet = await prisma.circlesWallet.create({
            data: createArgs
        });

        return wallet;
    };
}