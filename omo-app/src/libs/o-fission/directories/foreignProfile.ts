import {Profile} from "../entities/profile";

export class ForeignProfile
{
  static async findByFissionUsername(fissionUsername:string, loadAvatar:boolean = true) : Promise<{
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

      const otherProfilePath = `https://ipfs.io/${dnsLinkResultObj.Path}/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland/me/userland`;
      const otherProfileData = await fetch(otherProfilePath);
      const otherProfileObj = await otherProfileData.json();
      if (!otherProfileObj)
        return null;

      if (loadAvatar)
      {
        const otherProfileAvatarUrl = `https://ipfs.io/${dnsLinkResultObj.Path}/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland/me.png/userland`;
        try
        {
          const otherProfileAvatarData = await fetch(otherProfileAvatarUrl);
          if (otherProfileAvatarData.status == 404)
          {
            return {
              profile: {
                name: "",
                ...otherProfileObj
              },
              avatar: null
            };
          }
          if (otherProfileAvatarData.status != 200)
          {
            throw new Error("Got a non 200 response for url " + otherProfileAvatarUrl)
          }

          const blob = await otherProfileAvatarData.blob();
          const buffer = Buffer.from(blob);

          return {
            profile: {
              name: "",
              ...otherProfileObj
            },
            avatar: `data:image/png;base64,${buffer.toString('base64')}`
          };
        }
        catch (e)
        {
          console.warn("Couldn't load the avatar of '" + fissionUsername + "'");
        }
      }

      return {
        profile: {
          name: "",
          ...otherProfileObj
        },
        avatar: null
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
