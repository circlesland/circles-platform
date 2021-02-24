import { Directory, DirectoryChangeType } from "./directory";
import FileSystem from "omo-webnative/dist/fs/filesystem";
import {Profile} from "omo-models/dist/omo/profile";

export class Profiles extends Directory<Profile>
{
  constructor(fissionUser:string, fs: FileSystem) {
    super(fissionUser, fs, ["profiles"]);
  }

  async tryGetMyProfile(): Promise<Profile | undefined> {
    return await this.tryGetEntityByName("me");
  }

  async tryGetMyAvatarDataUrl(): Promise<string | null>
  {
    const data = await this.tryGetMyAvatarAsBuffer();
    if (Buffer.isBuffer(data))
    {
      return `data:image/png;base64,${data.toString('base64')}`;
    } else {
      throw new Error("Returned data is not a Buffer.");
    }
  }

  async tryGetMyAvatarAsBuffer(): Promise<Buffer | null>
  {
    const path = this.getPath(["me.png"]);
    if (!(await this.fs.exists(path)))
    {
      return null;
    }
    const data = await this.fs.cat(path);
    if (Buffer.isBuffer(data))
    {
      return data;
    } else {
      throw new Error("Returned data is not a Buffer.");
    }
  }

  async addOrUpdateMyAvatar(imageData:Buffer, publish:boolean) : Promise<{
    published:boolean
    fsRootCid?:string
  }>
  {
    await this.fs.add(this.getPath(["me.png"]), imageData);
    await this.fs.add("public/Apps/MamaOmo/OmoSapien/profiles/me.png", imageData);

    const cid = publish
        ? await this.fs.publish()
        : undefined;

    return {
      published: publish,
      fsRootCid: cid
    }
  }

  async addOrUpdateMyProfile(myProfile: Profile) {
    if (myProfile.name !== "me") {
      throw new Error("The own profile must always have the name 'me'.");
    }
    return await this.addOrUpdateEntity(myProfile, true, "addOrUpdateMyProfile");
  }

  async maintainIndexes(change: DirectoryChangeType, entity: Profile, hint?: string): Promise<void>
  {
    if (entity.name === "me" && hint !== "addOrUpdateMyProfile")
    {
      throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
    }

    // Add or update a public version of 'me' to my public directory
    if (entity.name === "me")
    {
      await this.fs.add("public/Apps/MamaOmo/OmoSapien/profiles/me", JSON.stringify(entity));
    }
  }
}
