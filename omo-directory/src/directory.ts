import {OfferMetadata} from "./indexes/offers";

export interface Entity {
    name: string;
}

export interface Entry {
    avatarCid: string;
    fissionName: string;
    circlesSafe: string;
    firstName: string;
    lastName: string;
}

export interface Directory
{
    [fissionName: string]: Entry;
}

export interface Offers
{
    [fissionName: string]: OfferMetadata[];
}
