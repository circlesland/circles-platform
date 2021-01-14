import { Directory, DirectoryChangeType } from "./directory";
import { Profile } from "../entities/profile";
import FileSystem from "libs/webnative/fs/filesystem";
import {Offer} from "../entities/offer";
import {of} from "rxjs";

export class Offers extends Directory<Offer>
{
  constructor(fs: FileSystem) {
    super(fs, ["offers"]);
  }

  async publishOffer(name:string)
  {
    const offer = await this.tryGetByName(name);
    if (!offer)
      throw new Error(`Couldn't find an offer with the name '${name}'`);

    offer.isPublished = true;
    await this.addOrUpdate(offer);
  }

  async unpublishOffer(name:string)
  {
    const offer = await this.tryGetByName(name);
    if (!offer)
      throw new Error(`Couldn't find an offer with the name '${name}'`);

    offer.isPublished = false;
    await this.addOrUpdate(offer);
  }

  async maintainIndexes(change: DirectoryChangeType, entity: Offer, hint?: string): Promise<void>
  {
    if (entity.isPublished)
    {
      await this.fs.add("public/Apps/MamaOmo/OmoSapien/offers/" + entity.name, JSON.stringify(entity));
    }
    else
    {
      if (await this.fs.exists("public/Apps/MamaOmo/OmoSapien/offers/" + entity.name))
      {
        await this.fs.rm("public/Apps/MamaOmo/OmoSapien/offers/" + entity.name);
      }
    }
  }
}
