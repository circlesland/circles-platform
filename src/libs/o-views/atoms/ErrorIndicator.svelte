<script lang="ts">
  import * as stringify from "json-stringify-safe";
</script>
<div class="bg-danger p-5 overflow-y-scroll max-w-full">
  <span class="text-primary text-2xl">Can't load the dapp:</span><br/>
  <a href="mailto:team@omo.earth?subject=⦿ Error report&body={encodeURIComponent(`Note: This is template. You can send it as is or add further information to it. Especially helpful are the steps you took until you got this error message (Steps to reproduce).

Hi!

I experienced some trouble using your app.
Below are some information that might help you to debug the problem:

Steps to reproduce:
-

Error message:
${!window.o.lastError.message ? '-' : window.o.lastError.message}

Stack trace:
${window.o.lastError.stack}`)}">
    Please try to reload the page or contact us at <u>team@omo.earth</u> if the problem persists.
  </a><br/><br/>
  Details:
  {#if window.o.lastError && window.o.lastError.message}
    <br/><b>{window.o.lastError.message}</b><br/><br/>
  {/if}
  Stack trace:<br/>
  <pre>
    {#if window.o.lastError}
      {window.o.lastError.stack}
    {:else}
      No error details available. See the console for more details.
    {/if}
  </pre>
</div>
