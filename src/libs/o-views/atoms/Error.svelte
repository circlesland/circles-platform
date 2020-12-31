<script lang="ts">
  export let data: {
    error: Error
  };

  let error:Error;

  $: {
    console.log("data:", data);
    if (data)
    {
      error = data.error;
    }
  }
</script>

<div class="bg-danger p-5 overflow-y-scroll max-w-full" style="max-height: 24em">
  <span class="text-primary text-2xl">The process encountered an error:</span><br/>
  <a href="mailto:team@omo.earth?subject=⦿ Error report&body={encodeURIComponent(`Note: This is template. You can send it as is or add further information to it. Especially helpful are the steps you took until you got this error message (Steps to reproduce).

Hi!

I experienced some trouble using your app.
Below are some information that might help you to debug the problem:

Steps to reproduce:
-

Error message:
${!error.message ? '-' : error.message}

Stack trace:
${error.stack}`)}">
    Please try to reload the page or contact us at <u>team@omo.earth</u> if the problem persists.
  </a><br/><br/>
  Details:
  {#if error && error.message}
    <br/><b>{error.message}</b><br/><br/>
  {/if}
  Stack trace:<br/>
  <pre>
  {#if error}
    {error.stack}
  {:else}
    No error details available. See the console for more details.
  {/if}
</pre>
</div>
