import {TreeNode} from "../interfaces/treeNode";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {FissionDrive} from "../../../libs/o-fission/fissionDrive";
import {Subscription} from "rxjs";
import {runWithDrive} from "../../../libs/o-fission/initFission";
//import {defaultTimeout} from "webnative/logFormatted";

export abstract class FsNode implements TreeNode
{
  parent?: FsNode;

  icon: string;
  title: string;

  name: string;

  type: "directory" | "file";
  childNodes: TreeNode[] = [];

  get path() :string
  {
    const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
    let current: FsNode = this;
    let path = [];

    while (current)
    {
      path.unshift(current.name);
      current = current.parent;
    }


    throw new Error("Deine Mudda!")
    // return fissionAuthState.fission.fs.appPath(path);
  }

  constructor(parent: FsNode, name: string)
  {
    this.parent = parent;
    this.name = name;
    this.title = name;
  }

  async onCollapse(): Promise<void>
  {
    this.childNodes = [];
  }

  abstract onExpand(): Promise<void>;

  async delete()
  {
    await runWithDrive(async fissionDrive =>
    {
      await fissionDrive.fs.rm(this.path);
      await fissionDrive.fs.publish();
    });
  }
}
