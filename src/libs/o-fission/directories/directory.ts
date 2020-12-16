import FileSystem from "webnative/fs/filesystem";
import { Entity } from "../entities/entity";
import { CID } from "webnative/ipfs";
import {CacheEventGroup} from "../entities/cacheEvent";

export type DirectoryChangeType = "add" | "update" | "remove";

export abstract class Directory<TEntity extends Entity>
{
  private readonly _fs: FileSystem;
  private readonly _pathParts: string[];
  private readonly _entityFactory?:(data:string) => TEntity;

  protected get fs(): FileSystem {
    return this._fs;
  }

  constructor(fs: FileSystem, pathParts: string[], entityFactory?:(data:string) => TEntity) {
    this._pathParts = pathParts;
    this._fs = fs;
    this._entityFactory = entityFactory;
  }

  abstract maintainIndexes(change: DirectoryChangeType, entity: TEntity, indexHint?: string): Promise<void>;

  getPath(pathParts?: string[]): string {
    return this.fs.appPath(pathParts
      ? this._pathParts.concat(pathParts)
      : this._pathParts);
  }

  async exists(pathParts?: string[]): Promise<boolean> {
    return this.fs.exists(this.getPath(pathParts));
  }

  async ensureDirectoryExists(pathParts?: string[]): Promise<void> {
    if (!await this.exists(pathParts)) {
      await this.fs.mkdir(this.getPath(pathParts));
      await this.fs.publish();
    }
  }

  async listNames(): Promise<string[]> {
    if (!await this.exists()) {
      return [];
    }

    const listing = await this.fs.ls(this.getPath());
    const list = Object.entries(listing);
    return list.map(([name, _]) => name);
  }

  async listItems(): Promise<TEntity[]> {
    const names = await this.listNames();
    const items = await Promise.all(names.map(name => {
      return this.fs.cat(this.getPath([name]));
    }));

    if (this._entityFactory) {
      return items.map(o => this._entityFactory(o.toString()));
    }

    return items.map(item => <TEntity>JSON.parse(<string>item));
  }

  async tryGetByName<TSpecificEntity extends TEntity>(entityName: string): Promise<TSpecificEntity> {
    if (!await this.exists([entityName])) {
      return null;
    }

    const contents = await this.fs.cat(this.getPath([entityName]));

    if (this._entityFactory) {
      return <TSpecificEntity>this._entityFactory(contents.toString());
    }

    return <TSpecificEntity>JSON.parse(<string>contents);
  }

  async addOrUpdate(entity: TEntity, publish = true, indexHint?: string): Promise<{
    cid: CID,
    added: boolean,
    entity: TEntity
  }> {
    await this.ensureDirectoryExists();

    const result = {
      cid: "",
      added: await this.exists([entity.name]),
      entity: entity
    };

    await this.fs.add(
      this.getPath([entity.name]),
      JSON.stringify(entity));

    await this.maintainIndexes(
      result.added ? "add" : "update",
      entity,
      indexHint);

    result.cid = publish
      ? await this.fs.publish()
      : null;

    return result;
  }

  async tryRemove(entityName: string, publish = true, indexHint?: string): Promise<{
    cid: CID,
    entity: TEntity
  } | null> {
    const entity = await this.tryGetByName(entityName);
    if (!entity) {
      return null;
    }

    await this.fs.rm(this.getPath([entityName]));
    await this.maintainIndexes("remove", entity, indexHint);

    return {
      cid: publish
        ? await this.fs.publish()
        : null,
      entity: entity
    };
  }

  protected async publish(): Promise<string> {
    return await this.fs.publish();
  }
}
