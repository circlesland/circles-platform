<script lang="ts">
  import { Jumper } from "svelte-loading-spinners";

  export let data: { text: string };
</script>


<div class="flex items-center justify-center h-full mx-auto">
  <div class="mx-auto w-full">
    <Jumper size="150" color="#071D69" unit="px" />
    {#if data.text}
      <div class="flex p-10 text-center text-primary">{data.text}</div>
    {/if}
  </div>
</div>
