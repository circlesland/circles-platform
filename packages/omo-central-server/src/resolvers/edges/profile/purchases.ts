import {PrismaClient} from "@prisma/client";
import {Profile} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function profilePurchases(prisma:PrismaClient) {
    return async (parent:Profile, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        if (fissionName != parent.fissionName) {
            throw new Error(`Only the owner of a profile can access its purchases`);
        }
        const purchases = await prisma.purchase.findMany({
            where: {
                purchasedByFissionName: parent.fissionName
            }
        });
        return <any[]>purchases;
    };
}