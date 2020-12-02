<script lang="ts">
  import { Jumper } from "svelte-loading-spinners";

  export let data: { text: string };
</script>

<div class="flex items-center justify-center">
  <div>
    <Jumper size="150" color="#071D69" unit="px" /><br />
    {#if data.text}
      <div class="text-sm text-center text-primary font-primary">
        {data.text}
      </div>
    {/if}
  </div>
</div>
