<script lang="ts">
  import * as stringify from "json-stringify-safe";
</script>
<div class="flex items-center justify-center h-full w-full">
  <div class="bg-danger p-5">
    <span class="text-primary text-2xl">Can't load the dapp:</span><br/>
    <pre>
      {#if window.o.lastError}
        {window.o.lastError.stack}
      {:else}
        No error details available. See the console for more details.
      {/if}
    </pre>
    <br/>
    <a href="mailto:team@omo.earth?subject=⦿ Error report&body=Hi, I experienced the following error in your app: {window.o.lastError.stack}">
      Please contact us at team@omo.earth if the problem persists.
    </a>
  </div>
</div>
