import FileSystem from "omo-webnative/dist/fs/filesystem";
import {withTimeout} from "../fissionDrive";
import {FissionDir} from "../fissionDir";
import {Offer} from "./offer";
import {OfferDescription} from "./offer/offerDescription";
import {OfferMetadata} from "./offer/offerMetadata";

export class Offers extends FissionDir
{
  constructor(fissionUser: string, fs: FileSystem)
  {
    super(fissionUser, fs, ["offers"]);
  }

  async tryGetOfferByName(name:string) : Promise<Offer|null>
  {
    return await withTimeout(`tryGetOfferByName(${this.getPath([name])}`, async () =>
    {
      const offerMetadataData = await this.tryGetFileByPath([name, "metadata"]);
      if (!offerMetadataData)
      {
        return null;
      }

      const offerMetadataJson = offerMetadataData.toString();
      const offerMetadata:OfferMetadata = JSON.parse(offerMetadataJson);
      if (!offerMetadata)
      {
        console.warn("Encountered an unreadable offer: " + name);
        return null;
      }

      return new Offer(
          offerMetadata.description.productName
        , this._fissionUser
        , this.fs
        , offerMetadata);
    });
  }

  async createOffer(name: string, description: OfferDescription, publish: boolean = true): Promise<{
    offerDirectoryPath:string
    offerMetadataPath:string
    entity:Offer
    published: boolean
    fsRootCid?: string
  }>
  {
    return await withTimeout(`createOffer(${this.getPath([name])}, publish: ${publish})`, async () =>
    {
      const exists = await this.exists([name]);
      if (exists)
      {
        throw new Error(`You have already created an offer with the name '${name}'.`);
      }

      const offerMetadata: OfferMetadata = {
        owner: this._fissionUser,
        description: description,
        createdAt: new Date().toJSON(),
        name: "metadata",
        pictures: []
      };

      const offer = new Offer(name, this._fissionUser, this.fs);
      await offer.addOrUpdateEntity(offerMetadata);

      const cid = publish
          ? await this.fs.publish()
          : undefined;

      return {
        entity: offer,
        fsRootCid: cid,
        published: publish,
        offerDirectoryPath: this.getPath([name]),
        offerMetadataPath: this.getPath([name, "metadata"])
      };
    });
  }
}