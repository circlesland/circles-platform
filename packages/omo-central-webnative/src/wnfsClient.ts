import {WnfsClientInterface} from "./wnfsClientInterface";
import {
    CirclesToken,
    CirclesTokenTransfer, CirclesTokenTransferPredicate,
    CirclesTrustRelation, CirclesTrustRelationPredicate, CirclesWallet,
    Contact, CreateFileInput,
    File,
    Message,
    Offer,
    Profile, Purchase,
    QueryConversationInput,
    QueryOfferInput,
    QueryProfileInput,
    QueryPurchaseInput,
    QueryUniqueProfileInput, UpdateProfileInput
} from "omo-central-interfaces/dist/types";

export class WnfsClient implements WnfsClientInterface {
    circlesToken = {
        findUnique(param: { include?: { transfers: boolean }; where: { address: string }; select?: { owner: true } }): Promise<CirclesToken> {
            throw new Error(`NotImplemented`)
        },
        create(param: { data: any }): Promise<CirclesToken> {
            throw new Error(`NotImplemented`)
        }
    }
    circlesTokenTransfer = {
        findUnique(param: { include: { object?: boolean; subject?: boolean }; where: { id: number } }): Promise<CirclesTokenTransfer> {
            throw new Error(`NotImplemented`)
        },
        create(param: { include: { subject: boolean; object: boolean }; data: { createdAt: Date; predicate: CirclesTokenTransferPredicate; createdInBlockNo: number; subject: { connectOrCreate: { create: { addedAt: Date; address: string; addedByFissionName: string }; where: { address: string } } }; createdInBlockHash: string; value: string; object: { connectOrCreate: { create: { addedAt: Date; address: string; addedByFissionName: string }; where: { address: string } } } } }): Promise<CirclesTokenTransfer> {
            throw new Error(`NotImplemented`)
        }
    };
    circlesTrustRelation = {
        findUnique(param: { include: { object?: boolean; subject?: boolean }; where: { id: number } }): Promise<CirclesTrustRelation> {
            throw new Error(`NotImplemented`)
        },
        create(param: { include: { subject: boolean; object: boolean }; data: { createdAt: Date; predicate: CirclesTrustRelationPredicate; createdInBlockNo: number; subject: { connectOrCreate: { create: { addedAt: Date; address: string; addedByFissionName: string }; where: { address: string } } }; createdInBlockHash: string; weight: number; object: { connectOrCreate: { create: { addedAt: Date; address: string; addedByFissionName: string }; where: { address: string } } } } }): Promise<CirclesTrustRelation> {
            throw new Error(`NotImplemented`)
        }
    };
    circlesWallet = {
        findMany(param: { where: { address?: string; trust?: { AND: { some: { predicate: "RECEIVING_FROM" | "GIVING_TO"; objectAddress: string } }[] }; ownToken?: { address: string } } }): Promise<CirclesWallet[]> {
            throw new Error(`NotImplemented`)
        },
        findUnique(param: { include: { ownToken?: boolean; tokens?: boolean; transfers?: boolean; trusts?: { include?: { subject?: boolean; object?: boolean } } }; where: { address: string } }): Promise<CirclesWallet> {
            throw new Error(`NotImplemented`)
        },
        create(param: { data: any }): Promise<CirclesWallet> {
            throw new Error(`NotImplemented`)
        }
    };
    contact = {
        findMany(param: { where: { anchorProfileFissionName: string } }): Promise<Contact[]> {
            throw new Error(`NotImplemented`)
        },
        findUnique(param: { include?: { anchorProfile?: boolean; contactProfile?: boolean }; where: { id: number } }): Promise<Contact> {
            throw new Error(`NotImplemented`)
        }
    };
    file = {
        findMany(param: { where: { offerId: number } }): Promise<File[]> {
            throw new Error(`NotImplemented`)
        }
    };
    message = {
        findMany(param: { where: QueryConversationInput }): Promise<Message[]> {
            throw new Error(`NotImplemented`)
        },
        create(param: { data: { senderFissionName: string; createdAt: Date; recipientFissionName: string; topic: string; type: string; content: string } }): Promise<Message> {
            throw new Error(`NotImplemented`)
        },
        updateMany(param: { data: { readAt: Date }; where: { recipientFissionName: string; id: number } }): Promise<Message[]> {
            throw new Error(`NotImplemented`)
        }
    };
    offer = {
        findMany(param: { where: QueryOfferInput }): Promise<Offer[]> {
            throw new Error(`NotImplemented`)
        },
        updateMany(param: { where: QueryOfferInput; data: { unlistedAt: Date } }): Promise<Offer[]> {
            throw new Error(`NotImplemented`)
        },
        create(param: { include: { createdBy: boolean }; data: { country: string | null | undefined; deliveryTerms: string | undefined; createdBy: { connect: { fissionName: string } }; publishedAt: Date; city: string | null | undefined; price: string | undefined; description: string | null | undefined; category: string | null | undefined; title: string | undefined; pictures: { create: Array<CreateFileInput> } } }): Promise<Offer> {
            throw new Error(`NotImplemented`)
        }
    };
    profile = {
        findMany(param: { where: QueryProfileInput }): Promise<Profile[]> {
            throw new Error(`NotImplemented`)
        },
        findUnique(param: { where: QueryUniqueProfileInput; include?: { contacts?: { include?: { contactProfile?: boolean } } }; select?: { fissionRoot: boolean } }): Promise<Profile> {
            throw new Error(`NotImplemented`)
        },
        upsert(param: { create: { omoAvatarCid: string | undefined; omoFirstName: string | undefined; omoAvatarMimeType: string | undefined; circlesAddress: string | undefined; fissionRoot: string | undefined; omoLastName: string | undefined; fissionName: string }; update: UpdateProfileInput; where: { fissionName: string } }): Promise<Profile> {
            throw new Error(`NotImplemented`)
        }
    };
    purchase = {
        findMany(param: { where: QueryPurchaseInput; include?: { purchasedItem?: { include?: { createdBy?: true } }; purchasedBy?: true } }): Promise<Purchase[]> {
            throw new Error(`NotImplemented`)
        },
        findUnique(param: { include: { purchasedItem?: { include?: { createdBy?: boolean } } | boolean; purchasedBy?: true }; where: QueryPurchaseInput }): Promise<Purchase> {
            throw new Error(`NotImplemented`)
        }
    };
}