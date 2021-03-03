import {
    CirclesToken,
    CirclesTokenTransfer,
    CirclesTokenTransferPredicate,
    CirclesTrustRelation,
    CirclesTrustRelationPredicate,
    CirclesWallet,
    Contact,
    CreateFileInput,
    File,
    Message,
    Offer,
    Profile,
    Purchase,
    QueryConversationInput,
    QueryOfferInput,
    QueryProfileInput,
    QueryPurchaseInput,
    QueryUniqueProfileInput,
    UpdateProfileInput
} from "omo-central-interfaces/dist/types";

export interface WnfsClient {
    circlesToken: {
        findUnique(param: {
            include?: {
                transfers: boolean
            };
            where: {
                address: string
            },
            select?: {
                owner: true
            }
        }): Promise<CirclesToken>;
        create(param: {
            data: any
        }): Promise<CirclesToken>;
    };
    circlesTokenTransfer: {
        findUnique(param: {
            include: {
                object?: boolean
                subject?: boolean
            };
            where: {
                id: number
            }
        }): Promise<CirclesTokenTransfer>;
        create(param: {
            include: {
                subject: boolean;
                object: boolean
            };
            data: {
                createdAt: Date;
                predicate: CirclesTokenTransferPredicate;
                createdInBlockNo: number;
                subject: {
                    connectOrCreate: {
                        create: {
                            addedAt: Date;
                            address: string;
                            addedByFissionName: string
                        };
                        where: {
                            address: string
                        }
                    }
                };
                createdInBlockHash: string;
                value: string;
                object: {
                    connectOrCreate: {
                        create: {
                            addedAt: Date;
                            address: string;
                            addedByFissionName: string
                        };
                        where: {
                            address: string
                        }
                    }
                }
            }
        }): Promise<CirclesTokenTransfer>;
    };
    circlesTrustRelation: {
        findUnique(param: {
            include: {
                object?: boolean,
                subject?: boolean
            };
            where: {
                id: number
            }
        }): Promise<CirclesTrustRelation>;
        create(param: {
            include: {
                subject: boolean;
                object: boolean
            };
            data: {
                createdAt: Date;
                predicate: CirclesTrustRelationPredicate;
                createdInBlockNo: number;
                subject: {
                    connectOrCreate: {
                        create: {
                            addedAt: Date;
                            address: string;
                            addedByFissionName: string
                        };
                        where: {
                            address: string
                        }
                    }
                };
                createdInBlockHash: string;
                weight: number;
                object: {
                    connectOrCreate: {
                        create: {
                            addedAt: Date;
                            address: string;
                            addedByFissionName: string
                        };
                        where: {
                            address: string
                        }
                    }
                }
            }
        }): Promise<CirclesTrustRelation>;
    };
    circlesWallet: {
        findMany(param: {
            where: {
                address?: string;
                trust?: {
                    AND: {
                        some: {
                            predicate: "RECEIVING_FROM" | "GIVING_TO";
                            objectAddress: string
                        }
                    }[]
                };
                ownToken?: {
                    address: string
                }
            }
        }): Promise<CirclesWallet>;
        findUnique(param: {
            include: {
                ownToken?: boolean
                tokens?: boolean
                transfers?: true
            };
            where: {
                address: string
            }
        }): Promise<CirclesWallet>;
        create(param: {
            data: any
        }): Promise<CirclesWallet>;
    };
    contact: {
        findMany(param: {
            where: {
                anchorProfileFissionName: string
            }
        }): Promise<Contact[]>;
    };
    profile: {
        findMany(param: {
            where: QueryProfileInput
        }): Promise<Profile[]>;
        findUnique(param: {
            where: QueryUniqueProfileInput;
            include?: {
                contacts?: {
                    include?: {
                        contactProfile?: boolean
                    }
                }
            };
            select?: {
                fissionRoot: boolean
            }
        }): Promise<Profile>;
        upsert(param: {
            create: {
                omoAvatarCid: string|undefined;
                omoFirstName: string|undefined;
                omoAvatarMimeType: string|undefined;
                circlesAddress: string|undefined;
                fissionRoot: string|undefined;
                omoLastName: string|undefined;
                fissionName: string
            };
            update: UpdateProfileInput;
            where: {
                fissionName: string
            }
        }): Promise<Profile>;
    };
    file: {
        findMany(param: {
            where: {
                offerId: number
            }
        }): Promise<File[]>;
    };
    offer: {
        findMany(param: {
            where: QueryOfferInput
        }): Promise<Offer[]>;
        updateMany(param: {
            where: QueryOfferInput;
            data: { unlistedAt: Date };
        }): Promise<Offer[]>;
        create(param: {
            include: { createdBy: boolean };
            data: {
                country: string | null | undefined;
                deliveryTerms: string | undefined;
                createdBy: {
                    connect: {
                        fissionName: string
                    }
                };
                publishedAt: Date;
                city: string | null | undefined;
                price: string | undefined;
                description: string | null | undefined;
                category: string | null | undefined;
                title: string | undefined;
                pictures: {
                    create: Array<CreateFileInput>
                }
            }
        }): Promise<Offer>;
    };
    purchase: {
        findMany(param: {
            where: QueryPurchaseInput
        }): Promise<Purchase[]>;
        findUnique(param: {
            include: {
                purchasedItem: {
                    include: {
                        createdBy: true
                    }
                }|boolean,
                purchasedBy: true
            }
            where: QueryPurchaseInput
        }): Promise<Purchase>;
    };
    message: {
        findMany(param: {
            where: QueryConversationInput
        }): Promise<Message[]>;
        create(param: {
            data: {
                senderFissionName: string;
                createdAt: Date;
                recipientFissionName: string;
                topic: string;
                type: string;
                content: string
            }
        }): Promise<Message>;
        updateMany(param: {
            data: {
                readAt: Date
            };
            where: {
                recipientFissionName: string;
                id: number
            }
        }): Promise<Message[]>;
    };
}