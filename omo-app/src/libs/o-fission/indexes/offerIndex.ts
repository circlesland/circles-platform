import {Index} from "./index";

export interface OfferIndexEntry {
  fissionName: string;
  circlesSafe: string;
  firstName: string;
  lastName: string;
}

export interface OfferIndexData
{
  byFissionName: {
    [fissionName:string]: OfferIndexEntry
  },
  byCirclesSafe?: {
    [safeAddress:string]: OfferIndexEntry
  }
}

export class OfferIndex extends Index
{
}
