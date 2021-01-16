import { Directory, DirectoryChangeType } from "./directory";
import FileSystem from "webnative/fs/filesystem";
import {Token} from "../../../omo-models/dist/token";
import {CachedTokens} from "../../../omo-models/dist/cachedTokens";

export class CirclesTokens extends Directory<CachedTokens>
{
  constructor(fissionUser:string, fs: FileSystem) {
    super(fissionUser, fs, ["tokens"]);
  }

  async tryGetMyToken(): Promise<Token | null> {
    const result = await this.tryGetEntityByName("me");
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
    return await this.addOrUpdateEntity(<any>myToken, true, "addMyToken");
  }

  async maintainIndexes(change: DirectoryChangeType, entity: CachedTokens, hint?: string): Promise<void> {
    if (entity.name === "me" && hint !== "addMyToken") {
      throw new Error(`The 'me' entity is a system entity in '${this.getPath()}' and should not be used directly.`);
    }
  }
}
