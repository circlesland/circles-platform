import { Directory, DirectoryChangeType } from "./directory";
import FileSystem from "webnative/fs/filesystem";
import {SessionLog} from "omo-models/dist/omo/sessionLog";

export class SessionLogs extends Directory<SessionLog>
{
  constructor(fissionUser:string, fs: FileSystem) {
    super(fissionUser, fs, ["logs"]);
  }

  async maintainIndexes(change: DirectoryChangeType, entity: SessionLog, indexHint: string | undefined)
  {
  }
}
