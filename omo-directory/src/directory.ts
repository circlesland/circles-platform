export interface Entity {
    name: string;
}

export interface Entry {
    fissionName: string;
    circlesSafe: string;
    firstName: string;
    lastName: string;
}

export interface Offer extends Entity
{
    isPublished: boolean;
    offeredByFissionName: string;
    productName: string;
    productPicture: string;
    productPrice: string;
    productDescription: string;
    productLocation: any;
}

export interface Directory
{
    [fissionName: string]: Entry;
}

export interface Offers
{
    [fissionName: string]: Offer[];
}
