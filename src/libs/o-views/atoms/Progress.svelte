<script lang="ts">
  import { Jumper } from "svelte-loading-spinners";

  export let data: { text: string };
</script>

<div class="flex justify-center">
  <div>
    <Jumper size="150" color="#071D69" unit="px" />
    {#if data.text}
      <div class="p-10 text-center text-primary">{data.text}</div>
    {/if}
  </div>
</div>
