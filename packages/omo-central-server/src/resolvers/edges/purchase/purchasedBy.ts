import {PrismaClient} from "@prisma/client";
import {Purchase} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function purchasedBy(prisma:PrismaClient) {
    return async (parent:Purchase, args:any, context:Context) => {
        const fissionName = await context.verifyJwt();
        const purchase = await prisma.purchase.findUnique({
            where: {
                id: parent.id
            },
            include: {
                purchasedBy: true
            }
        });
        if (!purchase || purchase.purchasedByFissionName !== fissionName) {
            throw new Error(`Couldn't find a purchase with the id ${parent.id}`);
        }
        return purchase.purchasedBy;
    };
}