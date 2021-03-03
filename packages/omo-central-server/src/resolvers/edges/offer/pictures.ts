import {PrismaClient} from "@prisma/client";
import {Offer} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";

export function offerPictures(prisma:PrismaClient) {
    return async (parent:Offer, args:any, context:Context) => {
        const pictures = await prisma.file.findMany({
            where: {
                offerId: parent.id
            }
        });
        return pictures;
    };
}