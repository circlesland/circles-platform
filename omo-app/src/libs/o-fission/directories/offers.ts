import { Directory, DirectoryChangeType } from "./directory";
import { Profile } from "../entities/profile";
import FileSystem from "libs/webnative/fs/filesystem";
import {Offer} from "../entities/offer";

export class Offers extends Directory<Offer>
{
  constructor(fs: FileSystem) {
    super(fs, ["offers"]);
  }

  async publishOffer(name:string)
  {
  }

  async unpublishOffer(name:string)
  {
  }

  async maintainIndexes(change: DirectoryChangeType, entity: Offer, hint?: string): Promise<void>
  {
    // TODO: Update a public version of the offer if it is published
  }
}
