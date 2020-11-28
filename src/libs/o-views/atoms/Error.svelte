<script lang="ts">
  import {ProcessArtifact} from "../../o-processes/interfaces/processArtifact";

  export let data:{[key:string]:ProcessArtifact};
</script>

{#if data.error && data.error.value}
  <h1 class="p-8 py-16 text-xl text-center text-white rounded-lg bg-danger">
    {data.error.value}
  </h1>
{/if}
