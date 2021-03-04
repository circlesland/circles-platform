import {PrismaClient, Offer, Contact, Purchase} from "@prisma/client";
import {Activity, ActivityPredicate, Profile} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function profileActivities(prisma:PrismaClient) {
    return async (parent:Profile, args:any, context:Context) => {
        // TODO: This is only a prototype. Streams must be created differently when this should survive load.

        // Public activities are:
        // * Profile created/updated/closed an Offer
        // * Profile updated/closed own Profile
        // Private activities are:
        // * Profile created/updated/closed a Contact
        // * Profile created/received a Message
        // * Profile created/proved a Purchase

        const fissionName = await context.verifyJwt();
        const activities: Activity[] = [];

        const createdOffers = await prisma.offer.findMany({
            where: {
                createdByFissionName: parent.fissionName
            },
            select: {
                publishedAt: true,
                createdByFissionName: true,
                id: true,
            }
        });
        createdOffers.forEach((offer:{publishedAt: Date, createdByFissionName: string, id: number}) => {
            activities.push({
                timestamp: offer.publishedAt.toJSON(),
                isPublic: true,
                subjectType: "profile",
                subjectKey: offer.createdByFissionName,
                predicate: ActivityPredicate.Created,
                objectType: "offer",
                objectKey: offer.id.toString()
            });
        });

        if (parent.fissionName === fissionName) {
            const createdContacts = await prisma.contact.findMany({
                where: {
                    anchorProfileFissionName: fissionName
                },
                select: {
                    id: true,
                    createdAt: true,
                    anchorProfileFissionName: true,
                    createdByType: true,
                    createdByKey: true,
                }
            });
            createdContacts.forEach((contact:{id: number, createdAt: Date, anchorProfileFissionName: string, createdByType: string | null, createdByKey: string | null}) => {
                activities.push({
                    timestamp: contact.createdAt.toJSON(),
                    isPublic: false,
                    subjectType: contact.createdByType ? contact.createdByType : "profile",
                    subjectKey: contact.createdByKey ? contact.createdByKey : fissionName,
                    predicate: ActivityPredicate.Created,
                    objectType: "contact",
                    objectKey: contact.id.toString()
                });
            });

            const purchases = await prisma.purchase.findMany({
                where: {
                    purchasedByFissionName: fissionName
                }
            });
            purchases.forEach((purchase:Purchase) => {
                activities.push({
                    timestamp: purchase.purchasedAt.toJSON(),
                    isPublic: false,
                    subjectType: "profile",
                    subjectKey: fissionName,
                    predicate: ActivityPredicate.Created,
                    objectType: "purchase",
                    objectKey: purchase.id.toString()
                });
            });

            const sales = await prisma.purchase.findMany({
                where: {
                    purchasedItem: {
                        createdByFissionName: fissionName
                    }
                }
            });
            sales.forEach((purchase:Purchase) => {
                activities.push({
                    timestamp: purchase.purchasedAt.toJSON(),
                    isPublic: false,
                    subjectType: "profile",
                    subjectKey: fissionName,
                    predicate: ActivityPredicate.Received,
                    objectType: "purchase",
                    objectKey: purchase.id.toString()
                });
            });
        }

        return activities.sort((a, b) => {
            const aTime = new Date(a.timestamp).getTime();
            const bTime = new Date(b.timestamp).getTime();
            return aTime > bTime ? 1 : aTime < bTime ? -1 : 0;
        });
    };
}