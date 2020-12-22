export interface TreeNode
{
  type: "directory" | "file",

  childNodes?: TreeNode[],

  icon: string,
  name: string,
  title: string,

  onCollapse(): Promise<void>;

  onExpand(): Promise<void>;
}
