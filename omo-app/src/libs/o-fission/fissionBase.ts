import FileSystem from "../../../libs/webnative/fs/filesystem";
import {withTimeout} from "./fissionDrive";

export abstract class FissionDir
{
  protected get fs(): FileSystem
  {
    return this._fs;
  }
  private readonly _fs: FileSystem;

  get pathParts() : string[]
  {
    return this._pathParts;
  }
  private readonly _pathParts: string[];

  protected readonly _fissionUser:string;

  static readonly defaultTimeout = 30000;

  constructor(
    fissionUser:string,
    fs: FileSystem,
    pathParts: string[])
  {
    window.o.logger.log("FissionDir.ctor(pathParts:" + pathParts.join(",") + ")")

    this._fissionUser = fissionUser;
    this._pathParts = pathParts;
    this._fs = fs;
  }

  static generateRandomHexString(length:number = 16)
  {
    const randomData = new Uint8Array(length);
    window.crypto.getRandomValues(randomData);
    const randomDataBuffer = Buffer.from(randomData);
    return randomDataBuffer.toString("hex");
  }

  getPath(pathParts?: string[]): string
  {
    return this.fs.appPath(pathParts
      ? this._pathParts.concat(pathParts)
      : this._pathParts);
  }

  async exists(pathParts?: string[]): Promise<boolean>
  {
    return withTimeout(
      `exists(${this.getPath(pathParts)})`
      , () => this.fs.exists(this.getPath(pathParts))
      , FissionDir.defaultTimeout);
  }

  async ensureDirectoryExists(pathParts?: string[], publish: boolean = true): Promise<void>
  {
    await withTimeout(`ensureDirectoryExists(${this.getPath(pathParts)})`, async () =>
    {
      if (!await this.exists(pathParts))
      {
        await this.fs.mkdir(this.getPath(pathParts));
      }
    }, FissionDir.defaultTimeout);

    if (publish)
    {
      await this.fs.publish();
    }
  }

  async listNames(): Promise<string[]>
  {
    return withTimeout(`listNames(${this.getPath()})`, async () => {
      if (!await this.exists()) {
        return [];
      }

      const listing = await this.fs.ls(this.getPath());
      const list = Object.entries(listing);
      return list.map(([name, _]) => name);
    }, FissionDir.defaultTimeout);
  }

  async tryGetFileByPath(pathParts:string[]) : Promise<Buffer>
  {
    return withTimeout(`tryGetFileByPath(${this.getPath(pathParts)})`, async () =>
    {
      const contents = await this.fs.cat(this.getPath(pathParts))
      if (Buffer.isBuffer(contents))
      {
        return contents;
      }
      else
      {
        return Buffer.from(<any>contents); // TODO: Mäh.
      }
    });
  }

  async tryGetFileByName(name:string) : Promise<Buffer>
  {
    return await this.tryGetFileByPath([name]);
  }

  async addOrUpdateFile(name:string, data:Buffer, publish:boolean = true, indexHint?:string) : Promise<boolean>
  {
    const exists = await withTimeout(`addOrUpdateFile(${this.getPath([name])}, data: ${data.length} bytes, publish: ${publish})`, async () =>
    {
      const exists = await this.exists([name]);
      await this.ensureDirectoryExists(null, publish);
      await this.fs.add(this.getPath([name]), data);

      return exists;
    }, FissionDir.defaultTimeout);

    if (publish)
    {
      await this.fs.publish();
    }

    return !exists
  }
}
