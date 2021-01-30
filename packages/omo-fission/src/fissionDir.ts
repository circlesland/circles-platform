import FileSystem from "omo-webnative/dist/fs/filesystem";
import {withTimeout} from "./fissionDrive";
import {BaseLink} from "omo-webnative/dist/fs/types";

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
    if (!fs)
    {
      throw new Error("The 'fs' parameter is null or undefined.");
    }
    this._fissionUser = fissionUser;
    this._pathParts = pathParts;
    this._fs = fs;
  }

  getPathFromApp(pathParts: string[]): string
  {
    if (!this.fs.appPath)
    {
      throw new Error("The FS's 'appPath' property has no value");
    }
    return this.fs.appPath(pathParts);
  }

  getPath(pathParts?: string[]): string
  {
    if (!this.fs.appPath)
    {
      throw new Error("The FS's 'appPath' property has no value");
    }
    return this.fs.appPath(pathParts
      ? this._pathParts.concat(pathParts)
      : this._pathParts);
  }

  async copyDirectory(fromPath:string, toPath:string, publish:boolean = true)
  {
    // const logger = window.o.logger.newLogger(`copyDirectory(from: ${fromPath}, to: ${toPath})`);
    // logger.log("begin");

    if (fromPath.endsWith("/"))
    {
      throw new Error(`The 'fromPath' must not end with a slash: '${fromPath}'`);
    }
    if (!toPath.endsWith("/"))
    {
      throw new Error(`The 'toPath' must end with a slash: '${toPath}'`);
    }

    const stack:{
      parentPath: string;
      baseLink:BaseLink;
    }[] = [];

    const contents = await this.fs.ls(fromPath);
    for (let contentsKey in contents)
    {
      const item = contents[contentsKey];
      stack.push({
        parentPath: fromPath,
        baseLink: item
      });
    }

    while (stack.length > 0)
    {
      const current = stack.pop();
      if (!current)
      {
        throw new Error("`'popped' an undefined entry from the stack`")
      }

      const currentSourcePath = current.parentPath + "/" + current.baseLink.name;
      const currentTargetPath = currentSourcePath.replace(fromPath + "/", toPath);

      if (current.baseLink.isFile)
      {
        // logger.log(`creating target file ${currentTargetPath} ..`);
        const sourceFileContents = await this.fs.cat(currentSourcePath);
        await this.fs.add(currentTargetPath, sourceFileContents, {publish: false});
      }
      else
      {
        // logger.log(`creating target directory ${currentTargetPath} ..`);
        await this.fs.mkdir(currentTargetPath, {publish: false});

        const contents = await this.fs.ls(currentSourcePath);
        for (let contentsKey in contents)
        {
          const item = contents[contentsKey];
          stack.push({
            parentPath: currentSourcePath,
            baseLink: item
          });
        }
      }
    }

    if (publish)
    {
      // logger.log(`publishing changes to fs ..`);
      await this.fs.publish();
    }

    // logger.log("end");
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

  async listPaths(): Promise<string[]>
  {
    const path = this.getPath();
    return withTimeout(`listPaths(${this.getPath()})`, async () => {
      const names = await this.listNames();
      return names.map(o => path + "/" + o);
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
      await this.ensureDirectoryExists(undefined, publish);
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
