<script>
  import Tree from "../molecules/Tree.svelte";
  import {DirectoryNode} from "../../nodes/directoryNode";

  let rootNode = new DirectoryNode(null, "");
  let rootNodes = [rootNode];

  rootNode.init();

</script>

<Tree rootNodes={rootNodes} />
