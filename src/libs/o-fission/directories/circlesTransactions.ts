import { Directory, DirectoryChangeType } from "./directory";
import FileSystem from "libs/webnative/fs/filesystem";
import {CachedTransactions} from "../entities/cachedTransactions";

export class CirclesTransactions extends Directory<CachedTransactions>
{
  constructor(fs: FileSystem) {
    super(fs, ["blocks"]);
  }

  async maintainIndexes(change: DirectoryChangeType, entity: CachedTransactions, hint?: string): Promise<void> {
  }
}
