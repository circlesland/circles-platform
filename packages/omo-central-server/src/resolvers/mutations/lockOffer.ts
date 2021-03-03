import {PrismaClient} from "@prisma/client";
import {MutationLockOfferArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";

export const lockTime = 90 * 1000;

export function lockOfferResolver(prisma:PrismaClient) {
    return async (parent:any, args:MutationLockOfferArgs, context:Context) => {
        /*
        Check if the offer is already locked
          - already locked ->
              Check if the lock is still valid (either not timed-out or PAYMENT_PROVEN)
                - still valid ->
                    Return an error
                - not valid ->
                    Set the state to INVALID
          - not locked ->
              Set the lock and return success
         */
        const fissionUsername = await context.verifyJwt();
        const profile = await prisma.profile.findUnique({
            where: {
                fissionName: fissionUsername
            }
        });
        if (!profile || !profile.circlesAddress) {
            throw new Error(`Couldn't find a profile for ${fissionUsername} or the profile has no associated circles safe`);
        }

        const existingLocks = await prisma.purchase.findMany({
            where: {
                purchasedItemId: args.data.offerId,
                status: {
                    not: "INVALID"
                }
            }
        });

        const now = Date.now();

        const invalidLocks = existingLocks.filter(lock => lock.purchasedAt.getTime() <= now - lockTime);
        await prisma.purchase.updateMany({
            data: {
                status: "INVALID"
            },
            where: {
                id: {
                    in: invalidLocks.map(o => o.id)
                }
            }
        });

        const validLocks = existingLocks.filter(lock => lock.purchasedAt.getTime() > now - lockTime || lock.purchasedProvenAt);
        if (validLocks.length > 0) {
            console.log(`Cannot lock offer ${args.data.offerId} because it is already locked or sold.`);
            return {
                success: false
            }
        }

        const lock = await prisma.purchase.create({
            data: {
                purchasedAt: new Date(now),
                status: "ITEM_LOCKED",
                purchasedByFissionName: fissionUsername,
                purchasedItemId: args.data.offerId
            }
        });

        return {
            success: true,
            lockedUntil: new Date(lock.purchasedAt.getTime() + lockTime).toJSON()
        };
    };
}