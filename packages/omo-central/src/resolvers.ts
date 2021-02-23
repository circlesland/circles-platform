import {PrismaClient} from '@prisma/client'
import {QueryOffersArgs, QueryProfilesArgs, RequireFields, Resolvers} from "./types";
import {serverDid} from "./consts";
import {EventBroker} from "omo-utils/dist/eventBroker";
import {from} from 'ix/asynciterable';
import {map} from 'ix/asynciterable/operators';

const prisma = new PrismaClient()
const eventBroker = new EventBroker(); // TODO: Replace with IPFS PubSub?!

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
                value: args.fields[key]
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
                value: args.fields[key]
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
            q.publishedAt.gt = Date.parse(args.query.publishedAt_gt)
        }
        if (args.query.publishedAt_lt) {
            q.publishedAt.lt = Date.parse(args.query.publishedAt_lt)
        }
    }
    if (args.query.unpublishedAt_gt || args.query.unpublishedAt_lt)
    {
        q.unpublishedAt = {};
        if (args.query.unpublishedAt_gt) {
            q.unpublishedAt.gt = Date.parse(args.query.unpublishedAt_gt)
        }
        if (args.query.unpublishedAt_lt) {
            q.unpublishedAt.lt = Date.parse(args.query.unpublishedAt_lt)
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
        profile: async (parent, args, context) => {
            const q = whereProfile(args);
            const fissionName = context.verifyJwt();
            const profile = await prisma.profile.findUnique({
                where: {
                    ...q
                },
                include: {
                    receivedMessages: {
                        where: {
                            recipientFissionName: fissionName
                        }
                    },
                    sentMessages: {
                        where: {
                            senderFissionName: fissionName
                        }
                    },
                    offers: {
                        include: {
                            createdBy: true,
                            pictures: true
                        }
                    }
                }
            });

            if (!profile) {
                throw new Error(`Couldn't find a profile with the provided arguments.`)
            }

            return {
                ...profile,
                sentMessages: profile.sentMessages.map(m => {
                    return {
                        ...m,
                        createdAt: m.createdAt.toJSON(),
                        readAt: m.readAt?.toJSON(),
                    }
                }),
                receivedMessages: profile.receivedMessages.map(m => {
                    return {
                        ...m,
                        createdAt: m.createdAt.toJSON(),
                        readAt: m.readAt?.toJSON(),
                    }
                }),
                offers: profile.offers.map(o => {
                    return {
                        ...o,
                        publishedAt: o.publishedAt.toJSON(),
                        unpublishedAt: o.unpublishedAt?.toJSON()
                    };
                })
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
                },
                include: {
                    createdBy: {
                        select: {
                            fissionName: true
                        }
                    }
                }
            });

            return result.map(offer => {
                return {
                    ...offer,
                    publishedAt: offer.publishedAt.toJSON(),
                    unpublishedAt: offer.unpublishedAt?.toJSON()
                }
            });
        },
        offer: (parent, args, context) => {

        }
    },
    Mutation: {
        upsertProfile: async (parent, args, context) => {
            const fissionUsername = await context.verifyJwt();

            const profile = await prisma.profile.upsert({
                create: {
                    circlesAddress: args.data.circlesAddress,
                    fissionName: fissionUsername,
                    fissionRoot: args.data.fissionRoot,
                    omoAvatarCid: args.data.omoAvatarCid,
                    omoFirstName: args.data.omoFirstName,
                    omoLastName: args.data.omoLastName
                },
                update: {
                    ...args.data
                },
                where: {
                    fissionName: fissionUsername
                }
            });

            return profile
        },
        createOffer: async (parent, args, context) => {
            const fissionUsername = context.verifyJwt();
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
                unpublishedAt: offer.unpublishedAt?.toJSON()
            };
        },
        unpublishOffer: async (parent, args, context) => {
            const fissionUsername = context.verifyJwt();
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
            const fissionUsername = context.verifyJwt();
            const message = await prisma.message.create({
                data: {
                    senderFissionName: fissionUsername,
                    createdAt: new Date(),
                    recipientFissionName: args.data.toFissionName,
                    type: args.data.type,
                    cid: args.data.cid
                }
            });

            return {
                ...message,
                createdAt: message.createdAt.toJSON(),
                readAt: message.readAt?.toJSON()
            };
        },
        markMessageAsRead: async (parent, args, context) => {
            const fissionUsername = context.verifyJwt();
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
                const fissionName = context.verifyJwt();
                let topic = eventBroker.tryGetTopic(fissionName, "messages");
                if (!topic) {
                    topic = eventBroker.createTopic(fissionName, "messages");
                }

                const iterator = from(topic.observable).pipe(map(event => {
                    return {
                        message: event
                    }
                }));

                return iterator;
            },
        }
    }
};
