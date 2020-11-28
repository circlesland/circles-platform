<script lang="ts">
  import {ProcessArtifact} from "../../o-processes/interfaces/processArtifact";

  export let data:{[key:string]:ProcessArtifact};
</script>
{#if data.banner && data.banner.value}
<div class="text-center p-10 text-primary">{data.banner.value}</div>
{/if}
