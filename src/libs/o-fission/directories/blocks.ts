import { Directory, DirectoryChangeType } from "./directory";
import { KeyPair } from "../entities/keyPair";
import FileSystem from "webnative/fs/filesystem";
import {Blocks} from "../entities/blocks";

export class BlocksDir extends Directory<Blocks>
{
  constructor(fs: FileSystem) {
    super(fs, ["blocks"]);
  }

  async maintainIndexes(change: DirectoryChangeType, entity: KeyPair, hint?: string): Promise<void> {
  }
}
