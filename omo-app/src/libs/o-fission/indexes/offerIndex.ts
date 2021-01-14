import {Index} from "./index";

export interface OfferIndexEntry
{
  filename:string;
  offeredByFissionName: string;
  productName: string;
  productPicture: string;
  productPrice: string;
  productDescription: string;
  productLocation: any;
}

export interface OfferIndexData
{
  byFissionName: {
    [fissionName:string]: OfferIndexEntry
  }
}

export class OfferIndex extends Index
{
  async tryGetOfferIndex() : Promise<OfferIndexData>
  {
    const offerIndexCidResponse = await fetch("https://directory.omo.earth/offers");
    const offerIndexCid = await offerIndexCidResponse.text();
    const offerIndexDataBuffer = await Index.catCid(offerIndexCid);
    const offerIndexDataJson = offerIndexDataBuffer.toString();
    const offerIndex: OfferIndexData = JSON.parse(offerIndexDataJson);

    if (!offerIndex || !offerIndex.byFissionName)
    {
      return null;
    }

    return offerIndex;
  }
}
