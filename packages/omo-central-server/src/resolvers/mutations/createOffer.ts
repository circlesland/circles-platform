import {PrismaClient} from "@prisma/client";
import {MutationCreateOfferArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {EventBroker} from "omo-utils/dist/eventBroker";

export function createOfferResolver(prisma:PrismaClient, eventBroker:EventBroker) {
    return async (parent:any, args:MutationCreateOfferArgs, context:Context) => {
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
        const result = {
            ...offer,
            publishedAt: offer.publishedAt.toJSON(),
            unlistedAt: offer.unlistedAt?.toJSON(),
            purchasedAt: offer.purchasedAt?.toJSON()
        };

        //eventBroker.tryGetTopic("")

        return result;
    };
}