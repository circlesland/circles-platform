import { Directory, DirectoryChangeType } from "./directory";
import FileSystem from "webnative/fs/filesystem";
import {CachedTokens} from "../entities/cachedTokens";
import {Token} from "../entities/token";

export class CirclesTokens extends Directory<CachedTokens>
{
  constructor(fs: FileSystem) {
    super(fs, ["tokens"]);
  }

  async tryGetMyToken(): Promise<Token | null> {
    const result = await this.tryGetByName("me");
    if (!result)
    {
      return null;
    }

    return <Token><any>result;
  }

  async addMyToken(myToken: Token) {
    if (myToken.name !== "me") {
      throw new Error("The own token must always have the name 'me'.");
    }
    return await this.addOrUpdate(<any>myToken, true, "addMyToken");
  }

  async maintainIndexes(change: DirectoryChangeType, entity: CachedTokens, hint?: string): Promise<void> {
    if (entity.name === "me" && hint !== "addMyToken") {
      throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
    }
  }
}
