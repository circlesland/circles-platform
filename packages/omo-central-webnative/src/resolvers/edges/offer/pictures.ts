import {Offer} from "omo-central-interfaces/dist/types";
import {Context} from "../../../context";
import {WnfsClientInterface} from "../../../wnfsClientInterface";

export function offerPictures(wnfs:WnfsClientInterface) {
    return async (parent:Offer, args:any, context:Context) => {
        const pictures = await wnfs.file.findMany({
            where: {
                offerId: parent.id
            }
        });
        return pictures;
    };
}