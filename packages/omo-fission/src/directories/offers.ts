import {BinaryFile, Directory, DirectoryChangeType} from "./directory";
import FileSystem from "webnative/fs/filesystem";
import {withTimeout} from "../fissionDrive";
import {FissionDir} from "../fissionDir";
import {Entity} from "omo-models/dist/omo/entity";
import {Generate} from "omo-utils/dist/generate";

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

  async createOffer(name: string, description: OfferDescription, publish: boolean = true): Promise<Offer>
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

      if (publish)
      {
        await offer.publish();
      }

      return offer;
    });
  }
}

export class Offer extends Directory<OfferMetadata | BinaryFile> implements Entity
{
  private _cachedMetadata?: OfferMetadata;
  readonly name: string;

  constructor(name: string,
              fissionUser: string,
              fs: FileSystem,
              offerMetadata?:OfferMetadata)
  {
    super(fissionUser, fs, ["offers", name]);
    this.name = name;
    this._cachedMetadata = offerMetadata;
  }

  async tryGetMetadata(): Promise<OfferMetadata | undefined>
  {
    if (this._cachedMetadata)
    {
      return this._cachedMetadata;
    }

    this._cachedMetadata = await this.tryGetEntityByName<OfferMetadata>("metadata");
    return this._cachedMetadata;
  }

  protected async setMetadata(offerMetadata: OfferMetadata)
  {
    offerMetadata.owner = this._fissionUser;
    offerMetadata.lastUpdatedAt = new Date().toJSON();
    offerMetadata.name = "metadata";
    this._cachedMetadata = offerMetadata;

    return await this.addOrUpdateEntity(this._cachedMetadata);
  }

  async setDescription(description: OfferDescription)
  {
    if (this._cachedMetadata)
    {
      this._cachedMetadata.description = description;
    }
    else
    {
      await this.tryGetMetadata();
    }

    if (!this._cachedMetadata)
    {
      throw new Error("The offer has no metadata yet. You need to create a metadata file first before setting a description.");
    }

    await this.setMetadata(this._cachedMetadata);
  }

  async addPicture(pictureData: Buffer): Promise<string>
  {
    const metadata = await this.tryGetMetadata();
    if (!metadata)
    {
      throw new Error("A 'metadata' file must exist prior to adding pictures to an offer.");
    }
    if (!metadata.pictures)
    {
      metadata.pictures = [];
    }

    const pictureFilename = Generate.randomHexString();
    await this.addOrUpdateFile(pictureFilename, pictureData);

    metadata.pictures.push({
      file: {
        name: pictureFilename
      }
    });

    return pictureFilename;
  }

  async removePicture(name: string)
  {
    const metadata = await this.tryGetMetadata();
    if (!metadata || !metadata.pictures)
    {
      throw new Error("A 'metadata' file must exist prior to editing pictures of an offer.");
    }
    if (!await this.exists([name]) || metadata.pictures.find(o => o.file.name == name))
    {
      throw new Error("A product picture with the name '" + name + "' doesn't exist.")
    }
    await this.tryRemove(name);
  }

  async publishOffer()
  {
    const sourcePath = this.getPath();
    const destinationPath = `public/Apps/MamaOmo/OmoSapien/offers/${this.name}/`;

    await this.copyDirectory(sourcePath, destinationPath);

    const currentMetadata = await this.tryGetMetadata();
    if (!currentMetadata)
    {
      throw new Error(`Cannot publish offer '${this.name}' because the offer's metadata file couldn't be found at '${this.getPath([this.name])}'.`)
    }

    await this.setDescription({
      ...currentMetadata.description,
      isPublished: true
    });

    await fetch("https://directory.omo.earth/update/offers/" + this._fissionUser, {
      method: "POST"
    });
  }

  async unpublishOffer()
  {
    const destinationPath = `public/Apps/MamaOmo/OmoSapien/offers/${this.name}/`;
    await this.fs.rm(destinationPath);

    const currentMetadata = await this.tryGetMetadata();
    if (!currentMetadata)
    {
      throw new Error(`Cannot unpublish offer '${this.name}' because the offer's metadata file couldn't be found at '${this.getPath([this.name])}'.`)
    }
    await this.setDescription({
      ...currentMetadata.description,
      isPublished: false
    });

    await fetch("https://directory.omo.earth/update/offers/" + this._fissionUser, {
      method: "POST"
    });
  }

  async maintainIndexes(change: DirectoryChangeType, entity: OfferMetadata | BinaryFile, indexHint?: string)
  {
  }
}

export interface OfferMetadata extends Entity
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
