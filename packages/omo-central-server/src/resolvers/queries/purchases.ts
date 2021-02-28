import {PrismaClient} from "@prisma/client";
import {PurchaseStatus, QueryPurchasesArgs} from "../../types";
import {Context} from "../../context";

export function purchasesResolver(prisma:PrismaClient) {
    return async (parent: any, args: QueryPurchasesArgs, context: Context) => {
        const fissionName = await context.verifyJwt();
        if (args.query.purchasedByFissionName !== fissionName) {
            throw new Error(`You can only query your own purchases.`);
        }
        const purchases = await prisma.purchase.findMany({
            where: {
                purchasedByFissionName: args.query.purchasedByFissionName
            },
            include: {
                purchasedItem: {
                    include: {
                        createdBy: true
                    }
                },
                purchasedBy: true
            }
        });
        const mapStatus = (inStatus: "INVALID" | "ITEM_LOCKED" | "PAYMENT_PROVEN"): PurchaseStatus => {
            switch (inStatus) {
                case "INVALID":
                    return PurchaseStatus.Invalid;
                case "ITEM_LOCKED":
                    return PurchaseStatus.ItemLocked;
                case "PAYMENT_PROVEN":
                    return PurchaseStatus.PaymentProven;
                default:
                    throw new Error(`Unknown status`);
            }
        };
        return purchases.map(purchase => {
            return {
                ...purchase,
                status: mapStatus(purchase.status),
                purchasedAt: purchase.purchasedAt.toJSON(),
                purchasedFrom: purchase.purchasedItem.createdBy,
                purchasedItem: {
                    ...purchase.purchasedItem,
                    publishedAt: purchase.purchasedItem.publishedAt.toJSON(),
                    purchasedAt: purchase.purchasedItem.purchasedAt?.toJSON(),
                    unlistedAt: purchase.purchasedItem.unlistedAt?.toJSON()
                }
            }
        });
    };
}