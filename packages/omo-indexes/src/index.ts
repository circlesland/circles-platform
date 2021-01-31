import {IpfsNode} from "./ipfsNode";
import {Profile} from "./profileIndex";
import fetch from 'cross-fetch';
import {AsyncBroadcast} from "omo-utils/dist/asyncBroadcast";

export type TForeignProfile = {
  profile: Profile,
  avatar?: string
} | null;

export abstract class Index
{
  // Can be called multiple times by different callers for different values
  // but will only ever call the wrapped action once per unique parameter no matter how many callers ask.
  static fissionNameResolver: AsyncBroadcast<string, string> = new AsyncBroadcast<string, string>(async (fissionUser:string) =>
  {
    const dnsLink = `https://ipfs.io/api/v0/dns?arg=${fissionUser}.fission.name`;
    const dnsLinkResult = await fetch(dnsLink);
    const dnsLinkResultObj = await dnsLinkResult.json();

    if (!dnsLinkResultObj || !dnsLinkResultObj.Path)
    {
      return null;
    }

    return dnsLinkResultObj.Path;
  });

  /**
   * Resolves the current CID of the fission user's fs.
   * @param fissionUser
   */
  static async tryGetUserFsRoot(fissionUser: string): Promise<string | null>
  {
    return Index.fissionNameResolver.subscribeToResult(fissionUser);
  }

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

  static async tryGetFissionFile(nodeDirCid: string): Promise<Buffer | null>
  {
    return await IpfsNode.runWithIPFS(async ipfs =>
    {
      const fileContentCid = ipfs.ls(nodeDirCid);

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
