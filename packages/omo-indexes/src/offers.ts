export interface OfferMetadata
{
  createdAt: string;
  lastUpdatedAt?: string;
  owner: string;
  description: OfferDescription;
  pictures: OfferPicture[];
}

export interface OfferDescription
{
  isPublished: boolean;
  productName: string;
  productPrice: string;
  productDescription: string;
  productLocation?: OfferLocation;
}

export interface OfferLocation
{
  place_id: number,
  licence: string,
  osm_type: string,
  osm_id: number,
  boundingbox: number[],
  lat: number,
  lon: number,
  display_name: string,
  class: string,
  type: string,
  importance: number,
  icon: string
}

export interface OfferPicture
{
  width?: number;
  height?: number;
  title?: string;
  description?: string;
  file: BinaryFile;
}

export interface BinaryFile
{
  name:string
}
