import {Offer} from "../../../types";
import {Context} from "../../../context";
import {WnfsClient} from "../../../wnfsClient";

export function offerPictures(wnfs:WnfsClient) {
    return async (parent:Offer, args:any, context:Context) => {
        const pictures = await wnfs.file.findMany({
            where: {
                offerId: parent.id
            }
        });
        return pictures;
    };
}