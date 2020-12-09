import {Profile, ProfileType} from "../entities/profile";
import FileSystem from "webnative/fs/filesystem";
import {Directory, DirectoryChangeType} from "../directory";
import {EventStore} from "../eventStore";
import {CacheEvent} from "../entities/cacheEvent";

export class ProfileImpl implements Profile
{
  name: string;
  profileType: ProfileType;
  profileRef: string;
  nickname?:string;
  firstName?:string;
  lastName?:string;
  avatar?:string;

  events:EventStore<CacheEvent>;

  constructor(json:string)
  {
    const obj = <Profile>JSON.parse(json);
    this.name = obj.name;
    this.profileType = obj.profileType;
    this.profileRef = obj.profileRef;
    this.nickname = obj.nickname;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.avatar = obj.avatar;
  }

  async loadEvents ()
  {
    const fromBlock = 0;
    const toBlock = 0;
    await this.events.loadAllToCache(fromBlock, toBlock);
  }

  subscribe()
  {
  }
}

export class Profiles extends Directory<Profile>
{
  constructor(fs: FileSystem) {
    super(fs, ["profiles"], (json:string) => {
      return new ProfileImpl(json);
    });
  }

  async tryGetMyProfile(): Promise<Profile | null> {
    return await this.tryGetByName("me");
  }

  async addOrUpdateMyProfile(myProfile: Profile) {
    if (myProfile.name !== "me") {
      throw new Error("The own profile must always have the name 'me'.");
    }
    return await this.addOrUpdate(myProfile, true, "addOrUpdateMyProfile");
  }

  async maintainIndexes(change: DirectoryChangeType, entity: Profile, hint?: string): Promise<void> {
    if (entity.name === "me" && hint !== "addOrUpdateMyProfile") {
      throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
    }

    // Add or update a public version of 'me' to my public directory
    await this.fs.root.publicTree.add("me", JSON.stringify(entity));
  }
}
