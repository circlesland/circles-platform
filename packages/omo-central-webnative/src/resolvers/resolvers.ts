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
import {WnfsClient} from "../wnfsClient";

const wnfs = new WnfsClient()
const eventBroker = new EventBroker(); // TODO: Replace with IPFS PubSub?!

export const resolvers: Resolvers = {
    Query: {
        server: serverResolver,
        profiles: profilesResolver(wnfs),
        fissionRoot: fissionRootResolver(wnfs),
        offers: offersResolver(wnfs),
        activities: activitiesResolver(wnfs),
        contacts: contactsResolver(wnfs),
        conversation: conversationResolver(wnfs),
        purchases: purchasesResolver(wnfs),
        circlesWallets: circlesWalletsResolver(wnfs)
    },
    Mutation: {
        lockOffer: lockOfferResolver(wnfs),
        provePayment: provePaymentResolver(wnfs),
        upsertProfile: upsertProfileResolver(wnfs),
        createOffer: createOfferResolver(wnfs),
        unlistOffer: unlistOfferResolver(wnfs),
        sendMessage: sendMessageResolver(wnfs, eventBroker),
        markMessageAsRead: markMessageAsReadResolver(wnfs),
        addCirclesWallet: addCirclesWalletResolver(wnfs),
        addCirclesToken: addCirclesTokenResolver(wnfs),
        addCirclesTrustRelation: addCirclesTrustRelationResolver(wnfs),
        addCirclesTokenTransfer: addCirclesTokenTransferResolver(wnfs),
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
        sender: messageSender(wnfs),
        recipient: messageRecipient(wnfs)
    },
    Profile: {
        offers: profileOffers(wnfs),
        contacts: profileContacts(wnfs),
        purchases: profilePurchases(wnfs),
        activities: profileActivities(wnfs)
    },
    Contact: {
        anchorProfile: contactAnchorProfile(wnfs),
        contactProfile: contactProfile(wnfs),
    },
    Offer: {
        createdBy: offerCreatedBy(wnfs),
        pictures: offerPictures(wnfs)
    },
    Purchase: {
        purchasedFrom: purchasedFrom(wnfs),
        purchasedBy: purchasedBy(wnfs),
        purchasedItem: purchasedItem(wnfs)
    },
    CirclesWallet: {
        ownToken: ownTokenResolver(wnfs),
        tokens: tokensResolver(wnfs),
        trustRelations: trustRelationsResolver(wnfs),
        transfers: walletTransfersResolver(wnfs)
    },
    CirclesToken: {
        owner: ownerResolver(wnfs),
        transfers: tokenTransfersResolver(wnfs)
    },
    CirclesTrustRelation: {
        subject: trustRelationSubjectResolver(wnfs),
        object: trustRelationObjectResolver(wnfs)
    },
    CirclesTokenTransfer: {
        subject: circlesTransferSubjectResolver(wnfs),
        object: circlesTransferObjectResolver(wnfs)
    }
};
