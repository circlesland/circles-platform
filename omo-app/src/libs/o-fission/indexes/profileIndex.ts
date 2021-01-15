import {Index} from "./index";
import {IpfsNode} from "./ipfsNode";
import {Profile} from "../entities/profile";

export type TForeignProfile = {
  profile: Profile,
  avatarDataUrl?: string
} | null;

export interface ProfileIndexEntry
{
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
  static async signup(fissionUser: string): Promise<void>
  {
    await fetch("https://directory.omo.earth/signup/" + fissionUser, {
      method: "POST"
    });
  }

  static async tryGetProfileIndex(): Promise<ProfileIndexData | null>
  {
    console.log("tryGetProfileIndex()");

    const profileIndexCidResponse = await fetch("https://directory.omo.earth/directory");
    //const profileIndexCidResponse = await fetch("https://directory.omo.earth/profiles");
    const profileIndexCid = await profileIndexCidResponse.text();
    const profileIndexDataBuffer = await Index.catCid(profileIndexCid);
    const profileIndexDataJson = profileIndexDataBuffer.toString();
    const profileIndex: ProfileIndexData = JSON.parse(profileIndexDataJson);

    if (!profileIndex || !profileIndex.byFissionName)
    {
      return null;
    }

    Object.values(profileIndex.byFissionName)
      .forEach((o: ProfileIndexEntry) =>
      {
        if (!o.circlesSafe)
        {
          return;
        }
        if (!profileIndex.byCirclesSafe)
        {
          profileIndex.byCirclesSafe = {};
        }

        profileIndex.byCirclesSafe[o.circlesSafe] = o;
      });

    return profileIndex;
  }

  static async tryReadPublicProfile(fissionUser: string): Promise<TForeignProfile | null>
  {
    const fsRoot = await Index.tryGetUserFsRoot(fissionUser);
    if (!fsRoot)
    {
      return null;
    }

    let otherProfileObj;
    let otherProfileAvatar;

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
          const avatarBuffer = await this.catCid(element.cid.toString() + "/userland");
          otherProfileAvatar = `data:image/png;base64,${avatarBuffer.toString('base64')}`;
        }

        if (otherProfileAvatar && otherProfileObj)
        {
          break;
        }
      }

      return <TForeignProfile>{
        profile: {
          name: "",
          ...otherProfileObj
        },
        avatarDataUrl: otherProfileAvatar
      };
    });
  }
}
