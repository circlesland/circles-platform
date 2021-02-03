import {Index} from "./index";
import {IpfsNode} from "./ipfsNode";

export type Profile = {
  circlesAddress?: string;
  fissionName?: string;
  firstName?: string;
  lastName?: string;
};

export type TForeignProfile = {
  profile: Profile,
  avatarCid?: string,
  fsRootCid?: string
} | null;

export interface ProfileIndexEntry
{
  fsRootCid?:string;
  avatarCid?: string;
  fissionName: string;
  circlesSafe: string;
  firstName: string;
  lastName: string;
}

export interface ProfileIndexData
{
  byFissionName: {
    [fissionName: string]: ProfileIndexEntry
  },
  byCirclesSafe?: {
    [safeAddress: string]: ProfileIndexEntry
  }
}

export class ProfileIndex extends Index
{
  static async announceProfile(fissionUser: string): Promise<void>
  {/*
    await fetch("https://directory.omo.earth/update/profiles/:fissionName" + fissionUser, {
      method: "POST"
    });*/
  }

  static async tryGetProfileIndex(): Promise<ProfileIndexData | null>
  {
    console.log("tryGetProfileIndex()");

    const profileIndexCidResponse = await fetch("https://directory.omo.earth/directory");
    const profileIndexCid = await profileIndexCidResponse.text();
    const profileIndexDataBuffer = await Index.catCid(profileIndexCid);
    const profileIndexDataJson = profileIndexDataBuffer.toString();
    const profileIndex:{
        [fissionName: string]: ProfileIndexEntry
    } = JSON.parse(profileIndexDataJson);

    if (!profileIndex /*|| !profileIndex.byFissionName*/)
    {
      return null;
    }

    const pi:ProfileIndexData = {
        byFissionName: profileIndex,
        byCirclesSafe: {}
    }

    Object.values(pi.byFissionName)
        .forEach((o: ProfileIndexEntry) =>
        {
            if (!o.circlesSafe)
            {
                return;
            }

            if (!pi.byCirclesSafe)
            {
                pi.byCirclesSafe = {};
            }
            pi.byCirclesSafe[o.circlesSafe] = o;
        });

    return pi;
  }

  static async tryReadPublicProfile(fissionUser: string): Promise<TForeignProfile | null>
  {
    const fsRoot = await Index.tryGetUserFsRoot(fissionUser);
    if (!fsRoot)
    {
      return null;
    }

    let otherProfileObj:any;
    let otherProfileAvatarCid:any;

    return await IpfsNode.runWithIPFS(async ipfs =>
    {
      const path = fsRoot
        + "/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland";

      const publicProfileDir = ipfs.ls(path);

      for await (const element of publicProfileDir)
      {
        if (element.name === "me")
        {
          const profileBuffer = await this.catCid(element.cid.toString() + "/userland");
          otherProfileObj = JSON.parse(profileBuffer.toString());
        }
        if (element.name === "me.png")
        {
          otherProfileAvatarCid = element.cid.toString();
        }

        if (otherProfileAvatarCid && otherProfileObj)
        {
          break;
        }
      }

      return <TForeignProfile>{
        profile: {
          name: "",
          ...otherProfileObj
        },
        avatarCid: otherProfileAvatarCid
      };
    });
  }
}
