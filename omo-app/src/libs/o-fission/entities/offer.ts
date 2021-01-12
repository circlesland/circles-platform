import { Entity } from "./entity";

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
