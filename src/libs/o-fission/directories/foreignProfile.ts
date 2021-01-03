import {Profile} from "../entities/profile";

export class ForeignProfile
{
  static async findByFissionUsername(fissionUsername:string) : Promise<Profile>
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

      const otherProfilePath = `https://ipfs.io/${dnsLinkResultObj.Path}/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland/me/userland`;
      const otherProfileData = await fetch(otherProfilePath);
      const otherProfileObj = otherProfileData.json();
      return otherProfileObj;
    } catch (e)
    {
      console.warn("Couldn't load a foreign profile:");
      console.warn(e);
      return null;
    }
  }
}
