import {TreeNode} from "../interfaces/treeNode";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";

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

    return fissionAuthState.fission._fs.appPath(path);
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
    const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
    await fissionAuthState.fission._fs.rm(this.path);
    await fissionAuthState.fission._fs.publish();
  }
}
