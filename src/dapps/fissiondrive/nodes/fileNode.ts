import {FsNode} from "./fsNode";

export class FileNode extends FsNode
{
  type: "file" = "file";

  async onExpand(): Promise<void>
  {
    this.childNodes = [];
  }
}
