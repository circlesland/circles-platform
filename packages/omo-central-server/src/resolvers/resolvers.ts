
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
import {prisma_ro} from "../prisma_ro";
import {prisma_rw} from "../prisma_rw";

const eventBroker = new EventBroker(); // TODO: Replace with IPFS PubSub?!

export const resolvers: Resolvers = {
    Query: {
        server: serverResolver,
        profiles: profilesResolver(prisma_ro),
        fissionRoot: fissionRootResolver(prisma_ro),
        offers: offersResolver(prisma_ro),
        activities: activitiesResolver(prisma_ro),
        contacts: contactsResolver(prisma_ro),
        conversation: conversationResolver(prisma_ro),
        purchases: purchasesResolver(prisma_ro),
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
        lockOffer: lockOfferResolver(prisma_rw, eventBroker),
        provePayment: provePaymentResolver(prisma_rw, eventBroker),
        upsertProfile: upsertProfileResolver(prisma_rw, eventBroker),
        createOffer: createOfferResolver(prisma_rw, eventBroker),
        unlistOffer: unlistOfferResolver(prisma_rw, eventBroker),
        sendMessage: sendMessageResolver(prisma_rw, eventBroker),
        markMessageAsRead: markMessageAsReadResolver(prisma_rw)
    },
    Subscription: {
        activities: activitiesSubscription(eventBroker)
    },
    Message: {
        sender: messageSender(prisma_ro),
        recipient: messageRecipient(prisma_ro)
    },
    Profile: {
        offers: profileOffers(prisma_ro),
        contacts: profileContacts(prisma_ro),
        purchases: profilePurchases(prisma_ro),
        activities: profileActivities(prisma_ro)
    },
    Contact: {
        anchorProfile: contactAnchorProfile(prisma_ro),
        contactProfile: contactProfile(prisma_ro),
    },
    Offer: {
        createdBy: offerCreatedBy(prisma_ro),
        pictures: offerPictures(prisma_ro)
    },
    Purchase: {
        purchasedFrom: purchasedFrom(prisma_ro),
        purchasedBy: purchasedBy(prisma_ro),
        purchasedItem: purchasedItem(prisma_ro)
    }
};
