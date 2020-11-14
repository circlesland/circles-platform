<script lang="ts">
  export let area: string = "";
  export let overflow: Boolean = false;
</script>

<style>
  .leaf {
    overflow: hidden;
    height: 100%;
  }
</style>

<div class="bg-blue-200 leaf" style="grid-area: {area}">
  {#if overflow}
    <div class="h-full overflow-y-scroll bg-green-200">
      <slot />
    </div>
  {:else}
    <slot />
  {/if}
</div>
