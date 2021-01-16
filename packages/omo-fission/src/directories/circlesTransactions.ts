import { Directory, DirectoryChangeType } from "./directory";
import FileSystem from "webnative/fs/filesystem";
import {CachedTransactions} from "../../../omo-models/dist/cachedTransactions";

export class CirclesTransactions extends Directory<CachedTransactions>
{
  constructor(fissionUser:string, fs: FileSystem) {
    super(fissionUser, fs, ["transactions"]);
  }

  async maintainIndexes(change: DirectoryChangeType, entity: CachedTransactions, hint?: string): Promise<void> {
  }
}
