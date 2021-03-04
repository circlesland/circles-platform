import {PrismaClient} from "@prisma/client";
import {Offer} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function offerCreatedBy(prisma:PrismaClient) {
    return async (parent:Offer, args:any, context:Context) => {
        const profile = await prisma.profile.findUnique({
            where: {
                fissionName: parent.createdByFissionName
            }
        });
        if (!profile) {
            throw new Error(`Couldn't find the creator profile for offer ${parent.id}`);
        }
        return profile;
    };
}