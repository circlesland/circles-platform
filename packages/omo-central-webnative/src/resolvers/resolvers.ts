import {EventBroker} from "omo-utils/dist/eventBroker";
import {profilesResolver} from "./queries/profiles";
import {upsertProfileResolver} from "./mutations/upsertProfile";
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
import {Resolvers} from "omo-central-interfaces/dist/types";

const wnfs = new WnfsClient()
const eventBroker = new EventBroker(); // TODO: Replace with IPFS PubSub?!

// Everything that's commented out is currently implemented in
// omo-central-server. In the long run this functionality should
// move here too.
export const resolvers: Resolvers = {
    Query: {
        // offers: offersResolver(wnfs),
        // activities: activitiesResolver(wnfs),
        // contacts: contactsResolver(wnfs),
        // conversation: conversationResolver(wnfs),
        // purchases: purchasesResolver(wnfs),
        profiles: profilesResolver(wnfs),
        circlesWallets: circlesWalletsResolver(wnfs)
    },
    Mutation: {
        //createOffer: createOfferResolver(wnfs),
        //unlistOffer: unlistOfferResolver(wnfs),
        //sendMessage: sendMessageResolver(wnfs, eventBroker),
        //markMessageAsRead: markMessageAsReadResolver(wnfs),
        upsertProfile: upsertProfileResolver(wnfs),
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
    // Subscription: {
    //     activities: activitiesSubscription(eventBroker),
    //     messages: messagesSubscription(eventBroker)
    // },
    // Message: {
    //     sender: messageSender(wnfs),
    //     recipient: messageRecipient(wnfs)
    // },
    // Profile: {
    //     offers: profileOffers(wnfs),
    //     contacts: profileContacts(wnfs),
    //     purchases: profilePurchases(wnfs),
    //     activities: profileActivities(wnfs)
    // },
    // Contact: {
    //     anchorProfile: contactAnchorProfile(wnfs),
    //     contactProfile: contactProfile(wnfs),
    // },
    // Offer: {
    //     createdBy: offerCreatedBy(wnfs),
    //     pictures: offerPictures(wnfs)
    // },
    // Purchase: {
    //     purchasedFrom: purchasedFrom(wnfs),
    //     purchasedBy: purchasedBy(wnfs),
    //     purchasedItem: purchasedItem(wnfs)
    // },
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
