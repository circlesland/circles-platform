<script lang="ts">
  import * as stringify from "json-stringify-safe";
</script>
<div class="flex items-center justify-center h-full w-full">
  <div class="bg-danger text-center p-5">
    <span class="text-primary text-2xl">Error</span><br/>
    <pre>
      {#if window.o.lastError}
        {stringify(window.o.lastError, null, 2)}
      {:else}
        No error details available. See the console for more details.
      {/if}
    </pre>
  </div>
</div>
