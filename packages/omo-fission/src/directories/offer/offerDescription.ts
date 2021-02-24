import {OfferLocation} from "./offerLocation";

export interface OfferDescription
{
    isPublished: boolean;
    productName: string;
    productPrice: string;
    productDescription: string;
    productLocation?: OfferLocation;
}