import {PrismaClient} from "@prisma/client";
import {Profile} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function profileOffers(prisma:PrismaClient) {
    return async (parent:Profile, args:any, context:Context) => {
        const offers = await prisma.offer.findMany({
            where: {
                createdBy: {
                    fissionName: parent.fissionName
                },
                unlistedAt: null
            }
        });
        return <any[]>offers;
    };
}