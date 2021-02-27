import {PrismaClient} from '@prisma/client'
import {ActivityPredicate, QueryOffersArgs, QueryProfilesArgs, RequireFields, Resolvers} from "./types";
import {serverDid} from "./consts";
import {EventBroker} from "omo-utils/dist/eventBroker";
import {from} from 'ix/asynciterable';
import {map} from 'ix/asynciterable/operators';
import {Activity} from "../dist/types";

const prisma = new PrismaClient()
const eventBroker = new EventBroker(); // TODO: Replace with IPFS PubSub?!
const lockTime = 90 * 1000;

function whereProfile(args: RequireFields<QueryProfilesArgs, never>) {
    const q: { [key: string]: any } = {};
    if (!args.query) {
        throw new Error(`No query fields have been specified`);
    }
    Object.keys(args.query ?? {})
        .map(key => {
            return {
                key: key,
                // @ts-ignore
                value: args.query[key]
            }
        })
        .filter(kv => kv.value)
        .forEach(kv => {
            q[kv.key] = kv.value;
        });

    if (Object.keys(q).length === 0) {
        throw new Error(`At least one query field must be specified.`);
    }
    return q;
}

function whereOffer(args: RequireFields<QueryOffersArgs, never>) {
    const q: { [key: string]: any } = {};
    if (!args.query) {
        throw new Error(`No query fields have been specified`);
    }
    Object.keys(args.query ?? {})
        .filter(key => !key.endsWith("_lt") && !key.endsWith("_gt"))
        .map(key => {
            return {
                key: key,
                // @ts-ignore
                value: args.query[key]
            }
        })
        .filter(kv => kv.value)
        .forEach(kv => {
            q[kv.key] = kv.value;
        });

    if (args.query.publishedAt_gt || args.query.publishedAt_lt)
    {
        q.publishedAt = {};
        if (args.query.publishedAt_gt) {
            q.publishedAt.gt = new Date(args.query.publishedAt_gt)
        }
        if (args.query.publishedAt_lt) {
            q.publishedAt.lt = new Date(args.query.publishedAt_lt)
        }
    }
    if (args.query.unpublishedAt_gt || args.query.unpublishedAt_lt)
    {
        q.unpublishedAt = {};
        if (args.query.unpublishedAt_gt) {
            q.unpublishedAt.gt = new Date(args.query.unpublishedAt_gt)
        }
        if (args.query.unpublishedAt_lt) {
            q.unpublishedAt.lt = new Date(args.query.unpublishedAt_lt)
        }
    }

    if (Object.keys(q).length === 0) {
        throw new Error(`At least one query field must be specified.`);
    }

    return q;
}

export const resolvers: Resolvers = {
    Query: {
        omo: (parent, args) => {
            return {
                did: serverDid
            };
        },
        profiles: async (parent, args, context) => {
            const q = whereProfile(args);
            const profiles = await prisma.profile.findMany({
                where: {
                    ...q
                }
            });
            return profiles;
        },
        contacts: async (parent, args, context) => {
            const q = whereProfile(args);
            const result = await prisma.profile.findUnique({
                where: {
                    ...q
                },
                include: {
                    contacts: {
                        include: {
                            contactProfile: true,
                        }
                    }
                }
            });
            if (!result)
            {
                throw new Error(`Couldn't find a profile with query: ${JSON.stringify(q)}`)
            }
            return result.contacts.map(o => {
                return {
                    ...o,
                    createdAt: o.createdAt.toJSON()
                }
            });
        },
        fissionRoot: async (parent, args, context) => {
            const q = whereProfile(args);
            const result = await prisma.profile.findUnique({
                where: {
                    ...q
                },
                select: {
                    fissionRoot: true
                }
            });

            if (!result?.fissionRoot) {
                throw new Error(`Couldn't find a fission root with the provided arguments.`);
            }
            return result.fissionRoot;
        },
        offers: async (parent, args, context) => {
            const q = whereOffer(args);
            const result = await prisma.offer.findMany({
                where: {
                    ...q
                }
            });

            return <any[]>result.map(offer => {
                return {
                    ...offer,
                    publishedAt: offer.publishedAt.toJSON(),
                    unpublishedAt: offer.unpublishedAt?.toJSON()
                }
            });
        },
        offer: (parent, args, context) => {
            throw new Error("NotImplemented");
        },
        inbox: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();
            const messages = await prisma.message.findMany({
                where: {
                    senderFissionName: args.query?.senderFissionName ?? undefined,
                    recipientFissionName: fissionUsername
                }
            });
            return <any[]>messages;
        },
        outbox: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();
            const messages = await prisma.message.findMany({
                where: {
                    recipientFissionName: args.query?.recipientFissionName ?? undefined,
                    senderFissionName: fissionUsername
                }
            });
            return <any[]>messages;
        },
        conversation: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();
            const messages = await prisma.message.findMany({
                where: {
                    OR: [{
                        recipientFissionName: args.query.withFissionName ?? undefined,
                        senderFissionName: fissionUsername
                    }, {
                        recipientFissionName: fissionUsername,
                        senderFissionName: args.query.withFissionName ?? undefined
                    }]
                }
            });
            return <any[]>messages;
        }
    },
    Mutation: {
        lockOffer:  async (parent, args, context) => {
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
            if (!profile || !profile.circlesAddress)
            {
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
            if (validLocks.length > 0)
            {
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
        },
        provePayment:  async (parent, args, context) => {
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
            if (!profile || !profile.circlesAddress)
            {
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
            if (existingLocks.length == 0)
            {
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
                    unpublishedAt: new Date(now),
                    purchasedAt: new Date(now)
                },
                where: {
                    id: args.data.forOfferId
                }
            });

            return {
                success: true
            }
        },
        upsertProfile: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();
            const profile = await prisma.profile.upsert({
                create: {
                    ...args.data,
                    fissionName: fissionUsername
                },
                update: args.data,
                where: {
                    fissionName: fissionUsername
                }
            });

            return profile
        },
        createOffer: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();
            const offer = await prisma.offer.create({
                data: {
                    createdBy: {
                        connect: {
                            fissionName: fissionUsername
                        }
                    },
                    publishedAt: new Date(),
                    category: args.data?.category,
                    city: args.data?.city,
                    country: args.data?.country,
                    deliveryTerms: args.data?.deliveryTerms,
                    description: args.data?.description,
                    price: args.data?.price,
                    title: args.data?.title,
                    pictures: {
                        create: args.data.pictures
                    }
                },
                include: {
                    createdBy: true
                }
            });
            return {
                ...offer,
                publishedAt: offer.publishedAt.toJSON(),
                unpublishedAt: offer.unpublishedAt?.toJSON(),
                purchasedAt: offer.purchasedAt?.toJSON()
            };
        },
        unpublishOffer: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();
            const result = await prisma.offer.updateMany({
                where: {
                    id: args.offerId,
                    createdByFissionName: fissionUsername
                },
                data: {
                    unpublishedAt: new Date()
                }
            });

            return result.count > 0;
        },
        sendMessage: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();
            const message = await prisma.message.create({
                data: {
                    senderFissionName: fissionUsername,
                    createdAt: new Date(),
                    recipientFissionName: args.data.toFissionName,
                    topic: args.data.topic,
                    type: args.data.type,
                    content: args.data.content
                }
            });
            let topic = eventBroker.tryGetTopic(args.data.toFissionName, "messages");
            if (topic) {
                topic.publish(message);
            }
            return <any>{
                ...message,
                createdAt: message.createdAt.toJSON(),
                readAt: message.readAt?.toJSON()
            };
        },
        markMessageAsRead: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();
            const result = await prisma.message.updateMany({
                where: {
                    id: args.messageId,
                    recipientFissionName: fissionUsername
                },
                data: {
                    readAt: new Date()
                }
            });
            return result.count > 0;
        }
    },
    Subscription: {
        messages: {
            subscribe: async (root, args, context) => {
                const fissionName = await context.verifyJwt();
                let topic = eventBroker.tryGetTopic(fissionName, "messages");
                if (!topic) {
                    topic = eventBroker.createTopic(fissionName, "messages");
                }

                const iterator = from(topic.observable).pipe(map(event => {
                    return {
                        messages: event
                    }
                }));

                return <any>iterator;
            },
        }
    },
    Message: {
        sender: async (parent, args, context) => {
            const profile = await prisma.profile.findUnique({
                where: {
                    fissionName: parent.senderFissionName
                }
            });
            if (!profile)
            {
                throw new Error(`Couldn't find a profile for fission name: ${parent.senderFissionName}`);
            }

            return profile;
        },
        recipient: async (parent, args, context) => {
            const profile = await prisma.profile.findUnique({
                where: {
                    fissionName: parent.recipientFissionName
                }
            });
            if (!profile)
            {
                throw new Error(`Couldn't find a profile for fission name: ${parent.senderFissionName}`);
            }

            return profile;
        }
    },
    Profile: {
        offers: async (parent, args, context) => {
            const offers = await prisma.offer.findMany({
                where: {
                    createdBy: {
                        fissionName: parent.fissionName
                    },
                    unpublishedAt: null
                }
            });
            return <any[]>offers;
        },
        contacts: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            if (fissionName != parent.fissionName)
            {
                throw new Error(`Only the owner of a profile can access its contacts`);
            }
            const contacts = await prisma.contact.findMany({
                where: {
                    anchorProfileFissionName: parent.fissionName
                }
            });
            return contacts.map(o => {
                return {
                    ...o,
                    createdAt: o.createdAt.toJSON()
                }
            });
        },
        sentMessages: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            if (fissionName != parent.fissionName)
            {
                throw new Error(`Only the owner of a profile can access its sent messages`);
            }
            const messages = await prisma.message.findMany({
                where: {
                    senderFissionName: fissionName
                }
            });
            return <any[]>messages;
        },
        receivedMessages: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            if (fissionName != parent.fissionName)
            {
                throw new Error(`Only the owner of a profile can access its received messages`);
            }
            const messages = await prisma.message.findMany({
                where: {
                    recipientFissionName: fissionName
                }
            });
            return <any[]>messages;
        },
        purchases: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            if (fissionName != parent.fissionName)
            {
                throw new Error(`Only the owner of a profile can access its purchases`);
            }
            const purchases = await prisma.purchase.findMany({
                where: {
                    purchasedByFissionName: parent.fissionName
                }
            });
            return <any[]>purchases;
        },
        activities: async (parent, args, context) => {

            // TODO: This is only a prototype. Streams must be created differently when this should survive load.

            // Public activities are:
            // * Profile created/updated/closed an Offer
            // * Profile updated/closed own Profile
            // Private activities are:
            // * Profile created/updated/closed a Contact
            // * Profile created/received a Message
            // * Profile created/proved a Purchase

            const fissionName = await context.verifyJwt();
            const activities:Activity[] = [];

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
            createdOffers.forEach(offer => {
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
                createdContacts.forEach(contact => {
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
                purchases.forEach(purchase => {
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
                sales.forEach(purchase => {
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

            return activities.sort((a,b) => {
                const aTime = new Date(a.timestamp).getTime();
                const bTime = new Date(b.timestamp).getTime();
                return aTime > bTime ? 1 : aTime < bTime ? -1 : 0;
            });
        },
    },
    Contact: {
        anchorProfile: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            const contact = await prisma.contact.findUnique({
                where: {
                    id: parent.id
                },
                include: {
                    anchorProfile: true
                }
            });
            if (!contact || contact.anchorProfileFissionName != fissionName)
            {
                throw new Error(`Couldn't find a contact with id ${parent.id}`);
            }
            return contact.anchorProfile;
        },
        contactProfile: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            const contact = await prisma.contact.findUnique({
                where: {
                    id: parent.id
                },
                include: {
                    contactProfile: true
                }
            });
            if (!contact || contact.anchorProfileFissionName != fissionName)
            {
                throw new Error(`Couldn't find a contact with id ${parent.id}`);
            }
            return contact.contactProfile;
        },
    },
    Offer: {
        createdBy: async (parent, args, context) => {
            const profile = await prisma.profile.findUnique({
                where: {
                    fissionName: parent.createdByFissionName
                }
            });
            if (!profile)
            {
                throw new Error(`Couldn't find the creator profile for offer ${parent.id}`);
            }
            return profile;
        },
        pictures: async (parent, args, context) => {
            const pictures = await prisma.file.findMany({
                where: {
                    offerId: parent.id
                }
            });
            return pictures;
        }
    },
    Purchase: {
        purchasedFrom: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            const purchase = await prisma.purchase.findUnique({
                where: {
                    id: parent.id
                },
                include: {
                    purchasedItem: {
                        include: {
                            createdBy: true
                        }
                    }
                }
            });
            if (!purchase || purchase.purchasedByFissionName !== fissionName)
            {
                throw new Error(`Couldn't find a purchase with the id ${parent.id}`);
            }
            return purchase.purchasedItem.createdBy;
        },
        purchasedBy: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            const purchase = await prisma.purchase.findUnique({
                where: {
                    id: parent.id
                },
                include: {
                    purchasedBy: true
                }
            });
            if (!purchase || purchase.purchasedByFissionName !== fissionName)
            {
                throw new Error(`Couldn't find a purchase with the id ${parent.id}`);
            }
            return purchase.purchasedBy;
        },
        purchasedItem: async (parent, args, context) => {
            const fissionName = await context.verifyJwt();
            const purchase = await prisma.purchase.findUnique({
                where: {
                    id: parent.id
                },
                include: {
                    purchasedItem: true
                }
            });
            if (!purchase || purchase.purchasedByFissionName !== fissionName)
            {
                throw new Error(`Couldn't find a purchase with the id ${parent.id}`);
            }
            return {
                ...purchase.purchasedItem,
                publishedAt: purchase.purchasedItem.publishedAt.toJSON(),
                unpublishedAt: purchase.purchasedItem.unpublishedAt?.toJSON(),
                purchasedAt: purchase.purchasedItem.purchasedAt?.toJSON(),
            };
        }
    }
};
