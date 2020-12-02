import { Directory, DirectoryChangeType } from "./directory";
import { Profile } from "../entities/profile";
import FileSystem from "webnative/fs/filesystem";
import { Token } from "../entities/token";

export class Tokens extends Directory<Token>
{
  constructor(fs: FileSystem) {
    super(fs, ["omosapien", "tokens"]);
  }

  async tryGetMyToken(): Promise<Token | null> {
    return await this.tryGetByName("me");
  }

  async addMyToken(myToken: Token) {
    if (myToken.name !== "me") {
      throw new Error("The own token must always have the name 'me'.");
    }
    return await this.addOrUpdate(myToken, "addMyToken");
  }

  async maintainIndexes(change: DirectoryChangeType, entity: Profile, hint?: string): Promise<void> {
    if (entity.name === "me" && hint !== "addMyToken") {
      throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
    }
  }
}
