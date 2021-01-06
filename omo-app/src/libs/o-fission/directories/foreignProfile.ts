import {Profile} from "../entities/profile";
import * as ipfs from 'webnative/ipfs'
import {IPFS} from "libs/webnative/ipfs";

export const ipfsCat = async (ipfs:IPFS, cid: string): Promise<Buffer> =>
{
  console.log("ipfsCat:", cid)
  const chunks = []
  for await (const chunk of ipfs.cat(cid)) {
    console.log("ipfsCat chunk no.:", chunks.length)
    if (Buffer.isBuffer(chunk))
      chunks.push(chunk)
    else
      chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export const ipfsGetFile = async (ipfs:IPFS, cid:string): Promise<Buffer> =>
{
  console.log("ipfsGetFile", cid);
  const fileContentCid = ipfs.ls(cid);

  for await (const fileCid of fileContentCid)
  {
    if (fileCid.name === "userland")
    {
      return await ipfsCat(ipfs, fileCid.cid.toString())
    }
  }
  return null;
}

export class ForeignProfile
{
  static async findByFissionUsername(fissionUsername:string) : Promise<{
    profile:Profile,
    avatar?: string
  }| null>
  {
    // TODO: Remove the hardcoded gateway and either use the webnative library or ipfs directly for this lookup
    try
    {
      const dnsLink = `https://ipfs.io/api/v0/dns?arg=${fissionUsername}.fission.name`;
      const dnsLinkResult = await fetch(dnsLink);
      const dnsLinkResultObj = await dnsLinkResult.json();

      if (!dnsLinkResultObj || !dnsLinkResultObj.Path)
      {
        return;
      }

      let ipfsCid = dnsLinkResultObj.Path;
      ipfsCid = ipfsCid.replace("/ipfs/", "");
      ipfsCid = ipfsCid.replace("/public", "");
      ipfsCid = ipfsCid + "/public/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland";

      const ipfsInstance = await ipfs.get()
      const dir = await ipfsInstance.ls(ipfsCid);

      let otherProfileObj;
      let otherProfileAvatar;

      for await (const element of dir)
      {
        if (element.name === "me")
        {
          const profileBuffer = await ipfsGetFile(ipfsInstance, element.cid.toString());
          otherProfileObj = JSON.parse(profileBuffer.toString());
        }
        if (element.name === "me.png")
        {
          const avatarBuffer = await ipfsGetFile(ipfsInstance, element.cid.toString());
          otherProfileAvatar = `data:image/png;base64,${avatarBuffer.toString('base64')}`;
        }
      }

      return {
        profile: {
          name: "",
          ...otherProfileObj
        },
        avatar: otherProfileAvatar
      };

    }
    catch (e)
    {
      console.warn("Couldn't load a foreign profile:");
      console.warn(e);
      return null;
    }
  }
}
