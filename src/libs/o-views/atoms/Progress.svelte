<script lang="ts">
  import {ProcessArtifact} from "../../o-processes/interfaces/processArtifact";
  import { Jumper } from "svelte-loading-spinners";

  export let data:{[key:string]:ProcessArtifact};
</script>
<Jumper size="150" color="#071D69" unit="px" /><br />
{#if data.progress && data.progress.value}
  <div class="text-center p-10 text-primary">{data.progress.value}</div>
{/if}
