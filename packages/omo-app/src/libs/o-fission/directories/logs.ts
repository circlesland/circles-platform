import { Directory, DirectoryChangeType } from "./directory";
import FileSystem from "libs/webnative/fs/filesystem";
import {CachedTokens} from "../entities/cachedTokens";
import {Token} from "../entities/token";
import {SessionLog} from "../entities/sessionLog";

export class SessionLogs extends Directory<SessionLog>
{
  constructor(fissionUser:string, fs: FileSystem) {
    super(fissionUser, fs, ["logs"]);
  }

  async maintainIndexes(change: DirectoryChangeType, entity: SessionLog, indexHint: string | undefined)
  {
  }
}
