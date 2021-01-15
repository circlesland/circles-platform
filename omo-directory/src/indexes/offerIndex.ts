import {Index} from "./index";
import {IpfsNode} from "./ipfsNode";
import {OfferMetadata} from "./offers";

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
  static async tryReadPublicOffers(fissionUser: string): Promise<OfferMetadata[]|null>
  {
    const fsRoot = await Index.tryGetUserFsRoot(fissionUser);
    if (!fsRoot)
    {
      return null;
    }

    return await IpfsNode.runWithIPFS(async ipfs =>
    {
      const path = fsRoot
        + "/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/offers/userland";

      const publicProfileDir = ipfs.ls(path);
      const offerNames:string[] = [];
      for await (const element of publicProfileDir)
      {
        offerNames.push(element.name);
      }

      const offers:OfferMetadata[] = await Promise.all(offerNames.map(async offerName => {
        const statResult = await ipfs.files.stat(path + "/" + offerName + "/userland/metadata");
        const metadataFile = await this.tryGetFissionFile(statResult.cid)
        if (!metadataFile)
        {
          throw new Error("The offer directory of offer '" + offerName + "' contains no 'metadata' file")
        }
        const offerMetadata:OfferMetadata = JSON.parse(metadataFile.toString());
        return offerMetadata;
      }));

      return offers;
    });
  }
}
