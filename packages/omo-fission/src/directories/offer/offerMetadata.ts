import {Entity} from "omo-models/dist/omo/entity";
import {OfferDescription} from "./offerDescription";
import {OfferPicture} from "./offerPicture";

export interface OfferMetadata extends Entity
{
    createdAt: string;
    lastUpdatedAt?: string;
    owner: string;
    description: OfferDescription;
    pictures: OfferPicture[];
}