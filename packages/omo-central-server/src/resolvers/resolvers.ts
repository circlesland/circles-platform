import {PrismaClient} from '@prisma/client'
import {EventBroker} from "omo-utils/dist/eventBroker";
import {Resolvers} from "../types";
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
import {circlesWalletsResolver} from "./queries/circlesWallets";
import {ownTokenResolver} from "./edges/circlesWallet/ownToken";
import {tokensResolver} from "./edges/circlesWallet/tokens";
import {trustRelationsResolver} from "./edges/circlesWallet/trustRelations";
import {tokenTransfersResolver} from "./edges/circlesToken/transfers";
import {ownerResolver} from "./edges/circlesToken/owner";
import {objectResolver as trustRelationObjectResolver} from "./edges/circlesTrustRelation/object";
import {subjectResolver as trustRelationSubjectResolver} from "./edges/circlesTrustRelation/subject";
import {objectResolver as circlesTransferObjectResolver} from "./edges/circlesTransfer/object";
import {subjectResolver as circlesTransferSubjectResolver} from "./edges/circlesTransfer/subject";
import {walletTransfersResolver} from "./edges/circlesWallet/transfers";
import {addCirclesTrustRelationResolver} from "./mutations/addCirclesTrustRelation";
import {addCirclesWalletResolver} from "./mutations/addCirclesWallet";
import {addCirclesTokenResolver} from "./mutations/addCirclesToken";
import {addCirclesTokenTransferResolver} from "./mutations/addCirclesTokenTransfer";

const prisma = new PrismaClient()
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
        circlesWallets: circlesWalletsResolver(prisma)
    },
    Mutation: {
        lockOffer: lockOfferResolver(prisma),
        provePayment: provePaymentResolver(prisma),
        upsertProfile: upsertProfileResolver(prisma),
        createOffer: createOfferResolver(prisma),
        unlistOffer: unlistOfferResolver(prisma),
        sendMessage: sendMessageResolver(prisma, eventBroker),
        markMessageAsRead: markMessageAsReadResolver(prisma),
        addCirclesWallet: addCirclesWalletResolver(prisma),
        addCirclesToken: addCirclesTokenResolver(prisma),
        addCirclesTrustRelation: addCirclesTrustRelationResolver(prisma),
        addCirclesTokenTransfer: addCirclesTokenTransferResolver(prisma),
        addKeyPair: async (parent, args, context) => {
            throw new Error(`NotImplemented`);
        },
        removeKeyPair: async (parent, args, context) => {
            throw new Error(`NotImplemented`);
        },
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
        ownToken: ownTokenResolver(prisma),
        tokens: tokensResolver(prisma),
        trustRelations: trustRelationsResolver(prisma),
        transfers: walletTransfersResolver(prisma)
    },
    CirclesToken: {
        owner: ownerResolver(prisma),
        transfers: tokenTransfersResolver(prisma)
    },
    CirclesTrustRelation: {
        subject: trustRelationSubjectResolver(prisma),
        object: trustRelationObjectResolver(prisma)
    },
    CirclesTokenTransfer: {
        subject: circlesTransferSubjectResolver(prisma),
        object: circlesTransferObjectResolver(prisma)
    }
};
