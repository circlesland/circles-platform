<script lang="ts">
  import { ProcessArtifact } from "../../o-processes/interfaces/processArtifact";
  import { Jumper } from "svelte-loading-spinners";

  export let data: { [key: string]: ProcessArtifact };
</script>

<div class="flex justify-center">
  <div>
    <Jumper size="150" color="#071D69" unit="px" />
    {#if data.progress && data.progress.value}
      <div class="p-10 text-center text-primary">{data.progress.value}</div>
    {/if}
  </div>
</div>
