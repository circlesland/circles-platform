import {PrismaClient} from "@prisma/client";
import {MutationProvePaymentArgs} from "../../types";
import {Context} from "../../context";

export function provePaymentResolver(prisma:PrismaClient) {
    return async (parent:any, args:MutationProvePaymentArgs, context:Context) => {
        /*
        Check if the user holds a lock on the claimed item
            - user has lock ->
                Check if the transaction hash belongs to a transaction from the buyer to the seller and has the right value
                    - transaction is valid ->
                        Set the purchase status to PAYMENT_PROVEN
         */
        const now = Date.now();
        const fissionUsername = await context.verifyJwt();
        const profile = await prisma.profile.findUnique({
            where: {
                fissionName: fissionUsername
            }
        });
        if (!profile || !profile.circlesAddress) {
            throw new Error(`Couldn't find a profile for ${fissionUsername} or the profile has no associated circles safe`);
        }

        const tokenOwners = args.data.tokenOwners;
        const sources = args.data.sources;
        const destinations = args.data.destinations;
        const values = args.data.values;

        // TODO: Validate the proof
        const existingLocks = await prisma.purchase.findMany({
            where: {
                purchasedItemId: args.data.forOfferId,
                purchasedByFissionName: fissionUsername,
                status: {
                    not: "PAYMENT_PROVEN"
                }
            }
        });
        if (existingLocks.length == 0) {
            throw new Error(`Couldn't find a previous lock for offer ${args.data.forOfferId}.`)
        }

        await prisma.purchase.update({
            data: {
                status: "PAYMENT_PROVEN"
            },
            where: {
                id: existingLocks[0].id
            }
        });

        await prisma.offer.update({
            data: {
                unlistedAt: new Date(now),
                purchasedAt: new Date(now)
            },
            where: {
                id: args.data.forOfferId
            }
        });

        return {
            success: true
        }
    };
}