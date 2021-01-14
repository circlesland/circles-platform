import FileSystem from "libs/webnative/fs/filesystem";
import { Entity } from "../entities/entity";
import { CID } from "libs/webnative/ipfs";
import {withTimeout} from "../fissionDrive";
import {FissionDir} from "../fissionBase";

export type DirectoryChangeType = "add" | "update" | "remove";

export interface BinaryFile extends Entity
{
}

export abstract class Directory<TEntity extends Entity> extends FissionDir
{
  private readonly _entityFactory?:(data:string) => Promise<TEntity>;
  private readonly _entitySerializer?:(entity:TEntity) => Promise<string>;

  constructor(
    fissionUser:string,
    fs: FileSystem,
    pathParts: string[],
    entityFactory?:(data:string) => Promise<TEntity>,
    entitySerializer?:(entity:TEntity) => Promise<string>)
  {
    super(fissionUser, fs, pathParts);

    window.o.logger.log("Directory.ctor(pathParts:" + pathParts.join(",") + ")")

    this._entityFactory = entityFactory;
    this._entitySerializer = entitySerializer;
  }

  abstract maintainIndexes(change: DirectoryChangeType, entity: TEntity, indexHint?: string): Promise<void>;

  async listItems(): Promise<TEntity[]>
  {
    return withTimeout(`listItems(${this.getPath()})`, async () => {
      const names = await this.listNames();
      const items = await Promise.all(names.map(name => {
        return this.fs.cat(this.getPath([name]));
      }));

      if (this._entityFactory) {
        return await Promise.all(items.map(async o => await this._entityFactory(o.toString())));
      }

      return items.map(item => <TEntity>JSON.parse(<string>item));
    }, Directory.defaultTimeout);
  }

  async tryGetEntityByName<TSpecificEntity extends TEntity>(entityName: string) : Promise<TSpecificEntity>
  {
    return withTimeout(`tryGetByName(${this.getPath([entityName])})`, async () =>
    {
      window.o.logger.log("Fission dir '" + this.getPath() + "': tryGetByName(entityName: '" + entityName + "')");
      if (!await this.exists([entityName])) {
        window.o.logger.log("Fission dir '" + this.getPath() + "': tryGetByName(entityName: '" + entityName + "') -> Doesn't exist");
        return null;
      }

      window.o.logger.log("Fission dir '" + this.getPath() + "': tryGetByName(entityName: '" + entityName + "') -> Exists");
      const contents = await this.fs.cat(this.getPath([entityName]));

      if (this._entityFactory) {
        return <TSpecificEntity>(await this._entityFactory(contents.toString()));
      }

      return <TSpecificEntity>JSON.parse(<string>contents);
    }, Directory.defaultTimeout);
  }

  async addOrUpdateEntity(entity: TEntity, publish = true, indexHint?: string) : Promise<boolean>
  {
    const result = await withTimeout(`addOrUpdate(${this.getPath([entity.name])}, publish: ${publish})`, async () =>
    {
      await this.ensureDirectoryExists(null, publish);

      const result = {
        added: await this.exists([entity.name]),
        entity: entity
      };

      const serializedEntity = this._entitySerializer
        ? await this._entitySerializer(entity)
        : JSON.stringify(entity);

      await this.fs.add(
        this.getPath([entity.name]),
        serializedEntity);

      return result;
    }, Directory.defaultTimeout);

    await withTimeout(`addOrUpdate(${this.getPath([entity.name])}, publish: ${publish})`, async () =>
    {
      await this.maintainIndexes(
        result.added ? "add" : "update",
        entity,
        indexHint);
    }
    , Directory.defaultTimeout);

    if (publish)
    {
      await this.fs.publish();
    }

    return result.added
  }

  async tryRemove(entityName: string, publish = true, indexHint?: string): Promise<{
    cid: CID,
    entity: TEntity
  } | null> {
    const entity = await withTimeout(`tryRemove(${this.getPath([entityName])}, publish: ${publish})`, async () => {
      const entity = await this.tryGetEntityByName(entityName);
      if (!entity) {
        return null;
      }

      await this.fs.rm(this.getPath([entityName]));
      await this.maintainIndexes("remove", entity, indexHint);

      return entity;
    }, Directory.defaultTimeout);

    return {
      cid: publish
        ? await this.fs.publish()
        : null,
      entity: entity
    };
  }

  async publish(): Promise<string> {
    return await this.fs.publish();
  }
}
