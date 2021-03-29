
import {EventBroker} from "omo-utils/dist/eventBroker";
import {serverResolver} from "./queries/server";
import {profilesResolver} from "./queries/profiles";
import {contactsResolver} from "./queries/contacts";
import {fissionRootResolver} from "./queries/fissionRoot";
import {offersResolver} from "./queries/offers";
import {conversationResolver} from "./queries/conversation";
import {lockOfferResolver} from "./mutations/lockOffer";
import {provePaymentResolver} from "./mutations/provePayment";
import {upsertProfileResolver} from "./mutations/upsertProfile";
import {createOfferResolver} from "./mutations/createOffer";
import {unlistOfferResolver} from "./mutations/unlistOffer";
import {sendMessageResolver} from "./mutations/sendMessage";
import {markMessageAsReadResolver} from "./mutations/markMessageAsRead";
import {messagesSubscription} from "./subscriptions/message";
import {activitiesSubscription} from "./subscriptions/activities";
import {messageSender} from "./edges/message/sender";
import {messageRecipient} from "./edges/message/recipient";
import {profileOffers} from "./edges/profile/offers";
import {profileContacts} from "./edges/profile/contacts";
import {profilePurchases} from "./edges/profile/purchases";
import {profileActivities} from "./edges/profile/activities";
import {contactAnchorProfile} from "./edges/contact/anchorProfile";
import {contactProfile} from "./edges/contact/contactProfile";
import {offerCreatedBy} from "./edges/offer/createdBy";
import {offerPictures} from "./edges/offer/pictures";
import {purchasedFrom} from "./edges/purchase/purchasedFrom";
import {purchasedBy} from "./edges/purchase/purchasedBy";
import {purchasedItem} from "./edges/purchase/purchasedItem";
import {activitiesResolver} from "./queries/activitities";
import {purchasesResolver} from "./queries/purchases";
import {Resolvers} from "omo-central-interfaces/dist/types";
import {prisma} from "../prismaClient";

const eventBroker = new EventBroker(); // TODO: Replace with IPFS PubSub?!

export const resolvers: Resolvers = {
    Query: {
        server: serverResolver,
        profiles: profilesResolver(prisma),
        fissionRoot: fissionRootResolver(prisma),
        offers: offersResolver(prisma),
        activities: activitiesResolver(prisma),
        contacts: contactsResolver(prisma),
        conversation: conversationResolver(prisma),
        purchases: purchasesResolver(prisma),
        /*
        circlesWallets: async (parent, args, context) => {
            const wallets = await prisma.circlesWallet.findMany({
                where: {
                    address: args.query.address,
                    ownToken: {
                        address: args.query.ownTokenAddress
                    },
                    trustObject: {
                        some: {
                            OR: [{
                                object: {
                                    address: args.query.trusts
                                },
                                predicate: "GIVING_TO"
                            },{
                                subject: {
                                    address: args.query.trusts
                                },
                                predicate: "RECEIVING_FROM"
                            }]
                        }
                    }
                }
            })
        },
        circlesTokens: async (parent, args, context) => {
        }
         */
    },
    Mutation: {
        lockOffer: lockOfferResolver(prisma, eventBroker),
        provePayment: provePaymentResolver(prisma, eventBroker),
        upsertProfile: upsertProfileResolver(prisma, eventBroker),
        createOffer: createOfferResolver(prisma, eventBroker),
        unlistOffer: unlistOfferResolver(prisma, eventBroker),
        sendMessage: sendMessageResolver(prisma, eventBroker),
        markMessageAsRead: markMessageAsReadResolver(prisma)
    },
    Subscription: {
        activities: activitiesSubscription(eventBroker)
    },
    Message: {
        sender: messageSender(prisma),
        recipient: messageRecipient(prisma)
    },
    Profile: {
        offers: profileOffers(prisma),
        contacts: profileContacts(prisma),
        purchases: profilePurchases(prisma),
        activities: profileActivities(prisma)
    },
    Contact: {
        anchorProfile: contactAnchorProfile(prisma),
        contactProfile: contactProfile(prisma),
    },
    Offer: {
        createdBy: offerCreatedBy(prisma),
        pictures: offerPictures(prisma)
    },
    Purchase: {
        purchasedFrom: purchasedFrom(prisma),
        purchasedBy: purchasedBy(prisma),
        purchasedItem: purchasedItem(prisma)
    }
};