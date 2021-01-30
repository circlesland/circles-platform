import {FsNode} from "./fsNode";
import {FileNode} from "./fileNode";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";

export class DirectoryNode extends FsNode
{
  type: "directory" = "directory";

  async init() : Promise<void>
  {
    if (!this.title || this.title === "")
    {
      const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
      this.title = fissionAuthState.username;
    }
  }

  async onExpand(): Promise<void>
  {
    await runWithDrive(async fissionDrive =>
    {
      const children: FsNode[] = [];

      const childFsNodes = await fissionDrive.fs.ls(this.path);

      for (let childFsNode of Object.values(childFsNodes))
      {
        const c:any = childFsNode;
        if (c.isFile)
        {
          children.push(new FileNode(this, c.name));
        }
        else
        {
          children.push(new DirectoryNode(this, c.name));
        }
      }

      this.childNodes = children;
    });
  }
}
