<script lang="ts">
  import {ProcessArtifact} from "../../o-processes/interfaces/processArtifact";

  export let data:{[key:string]:ProcessArtifact};
</script>

{#if data.success && data.success.value}
  <h1 class="px-8 py-16 text-xl text-center text-white rounded-lg bg-action">
    {data.success.value}
  </h1>
{/if}
