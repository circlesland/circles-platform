import { Directory, DirectoryChangeType } from "./directory";
import { KeyPair } from "omo-models/dist/omo/keyPair";
import FileSystem from "webnative/fs/filesystem";

export class Keys extends Directory<KeyPair>
{
  constructor(fissionUser:string, fs: FileSystem) {
    super(fissionUser, fs, ["keys"]);
  }

  async tryGetMyKey(): Promise<KeyPair | undefined> {
    return await this.tryGetEntityByName("me");
  }

  async addMyKey(myKey: KeyPair) {
    if (myKey.name !== "me") {
      throw new Error("The circles safe owner keypair must always be named 'me'.");
    }
    if (await this.exists(["me"])) {
      throw new Error("The circles safe owner keypair cannot be modified.")
    }
    return await this.addOrUpdateEntity(myKey, true, "addMyKey");
  }

  async maintainIndexes(change: DirectoryChangeType, entity: KeyPair, hint?: string): Promise<void> {
    if (entity.name === "me" && hint !== "addMyKey") {
      throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
    }
  }
}
