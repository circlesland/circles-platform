import {IpfsNode} from "./ipfsNode";
import {Profile} from "../entities/profile";

export type TForeignProfile = {
  profile: Profile,
  avatar?: string
} | null;

export abstract class Index
{
  static async catCid(cid: string): Promise<Buffer>
  {
    console.log("catCid")
    return await IpfsNode.runWithIPFS(async ipfs =>
    {
      const catIterable = ipfs.cat(cid);
      const chunks = []

      for await (const chunk of catIterable)
      {
          chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    });
  }

  static async tryGetFileFromDirectoryCid(cid: string): Promise<Buffer | null>
  {
    return await IpfsNode.runWithIPFS(async ipfs =>
    {
      const fileContentCid = ipfs.ls(cid);

      for await (const fileCid of fileContentCid)
      {
        if (fileCid.name === "userland")
        {
          return await this.catCid(fileCid.cid.toString())
        }
      }

      return null;
    });
  }
}
