import {Context} from "../../../context";

import {CirclesToken} from "omo-central-interfaces/dist/types";
import { PrismaClient } from "@prisma/client";

export function ownerResolver(prisma:PrismaClient) {
    return async (parent: CirclesToken, args: any, context: Context) => {
        const token = await prisma.circlesToken.findUnique({
            where: {
                address: parent.address
            },
            select: {
                owner: true
            }
        });
        if (!token) {
            throw new Error(`Couldn't find a token with the address ${parent.address}`);
        }
        return token.owner;
    };
}