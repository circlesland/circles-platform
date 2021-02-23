<script lang="ts">
  import {Jumper} from "svelte-loading-spinners";
  import LoadingSpinner from "./LoadingSpinner.svelte";

  export let data: { text: string };
</script>

<div class="flex items-center justify-center">
  <div>
    <LoadingSpinner />
    {#if data.text}
      <div class="text-sm text-center text-primary font-primary">
        {data.text}
      </div>
    {/if}
  </div>
</div>
