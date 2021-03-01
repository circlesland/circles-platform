import {PrismaClient} from '@prisma/client'
import {EventBroker} from "omo-utils/dist/eventBroker";
import {CirclesToken, CirclesTokenTransfer, CirclesTrustRelation, CirclesWallet, Resolvers} from "../types";
import {omoResolver} from "./queries/omo";
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
import {profileSentMessages} from "./edges/profile/sentMessages";
import {profileReceivedMessages} from "./edges/profile/receivedMessages";
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
import {walletsResolver} from "./queries/wallets";
import {Context} from "../context";

const prisma = new PrismaClient()
const eventBroker = new EventBroker(); // TODO: Replace with IPFS PubSub?!

export const resolvers: Resolvers = {
    Query: {
        omo: omoResolver,
        profiles: profilesResolver(prisma),
        fissionRoot: fissionRootResolver(prisma),
        offers: offersResolver(prisma),
        activities: activitiesResolver(prisma),
        contacts: contactsResolver(prisma),
        conversation: conversationResolver(prisma),
        purchases: purchasesResolver(prisma),
        wallets: walletsResolver(prisma)
    },
    Mutation: {
        lockOffer: lockOfferResolver(prisma),
        provePayment: provePaymentResolver(prisma),
        upsertProfile: upsertProfileResolver(prisma),
        createOffer: createOfferResolver(prisma),
        unlistOffer: unlistOfferResolver(prisma),
        sendMessage: sendMessageResolver(prisma, eventBroker),
        markMessageAsRead: markMessageAsReadResolver(prisma)
    },
    Subscription: {
        activities: activitiesSubscription(eventBroker),
        messages: messagesSubscription(eventBroker)
    },
    Message: {
        sender: messageSender(prisma),
        recipient: messageRecipient(prisma)
    },
    Profile: {
        offers: profileOffers(prisma),
        contacts: profileContacts(prisma),
        sentMessages: profileSentMessages(prisma),
        receivedMessages: profileReceivedMessages(prisma),
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
    },
    CirclesWallet: {
        ownToken: async (parent:CirclesWallet, args, context:Context) => {
            const subjectWallet = await prisma.circlesWallet.findUnique({
                where: {
                    address: parent.address
                },
                include: {
                    ownToken: true
                }
            });
            if (!subjectWallet){
                throw new Error(`Couldn't find a token with address ${parent.address}.`)
            }
            return <any>subjectWallet.ownToken;
        },
        tokens: async (parent:CirclesWallet, args, context:Context) => {
            const subjectWallet = await prisma.circlesWallet.findUnique({
                where: {
                    address: parent.address
                },
                include: {
                    knownTokens: true
                }
            });
            
        },
        trustRelations: async (parent:CirclesWallet, args, context:Context) => {
        }
    },
    CirclesToken: {
        tokenOwner: async (parent:CirclesToken, args, context:Context) => {
        },
        transfers: async (parent:CirclesToken, args, context:Context) => {
        }
    },
    CirclesTrustRelation: {
        object: async (parent:CirclesTrustRelation, args, context:Context) => {
        },
        subject: async (parent:CirclesTrustRelation, args, context:Context) => {
        }
    },
    CirclesTokenTransfer: {
        from: (parent:CirclesTokenTransfer, args, context:Context) => {
        },
        to: (parent:CirclesTokenTransfer, args, context:Context) => {
        }
    }
};
