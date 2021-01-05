import { Entity } from "./entity";

export interface Offer extends Entity
{
  productName: string;
  productPicture: string;
  productPrice: string;
  productDescription: string;
  productLocation: string;
}
