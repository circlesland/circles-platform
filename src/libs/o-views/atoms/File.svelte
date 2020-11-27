<script>
  export let folder;
  export let file;
</script>

{#if folder}
  <svelte:self {...file} />
{:else}{file}{/if}
