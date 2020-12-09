import { KeyPair } from "../entities/keyPair";
import FileSystem from "webnative/fs/filesystem";
import {Directory, DirectoryChangeType} from "../directory";

export class Keys extends Directory<KeyPair>
{
  constructor(fs: FileSystem) {
    super(fs, ["keys"], json => <KeyPair>JSON.parse(json));
  }

  async tryGetMyKey(): Promise<KeyPair | null> {
    return await this.tryGetByName("me");
  }

  async addMyKey(myKey: KeyPair) {
    if (myKey.name !== "me") {
      throw new Error("The circles safe owner keypair must always be named 'me'.");
    }
    if (await this.exists(["me"])) {
      throw new Error("The circles safe owner keypair cannot be modified.")
    }
    return await this.addOrUpdate(myKey, true, "addMyKey");
  }

  async maintainIndexes(change: DirectoryChangeType, entity: KeyPair, hint?: string): Promise<void> {
    if (entity.name === "me" && hint !== "addMyKey") {
      throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
    }
  }
}
