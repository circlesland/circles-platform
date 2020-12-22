<script lang="ts">
  import Node from "./Node.svelte";
  import {TreeNode} from "../../interfaces/treeNode";

  export let rootNodes: TreeNode[] = [];
</script>

<nav class="w-full h-full select-none overflow-y-auto">
  <ul>
    {#each rootNodes as rootNode}
      <Node treeNode={rootNode} level={1} />
    {/each}
  </ul>
</nav>
