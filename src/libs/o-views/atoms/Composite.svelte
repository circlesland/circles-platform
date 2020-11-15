<script lang="ts">
  export let layout = {
    areas: "'main'",
    columns: "1fr",
    rows: "1fr",
  };
  export let area: string = "app";
</script>

<style>
  .composite {
    display: grid;
    grid-template-areas: var(--areas);
    grid-template-columns: var(--columns);
    grid-template-rows: var(--rows);
    overflow: hidden;
  }
</style>

{#if area == 'app'}
  <div
    class="h-full composite"
    style="grid-area: {area}; --areas: {layout.areas}; --columns: {layout.columns}; --rows: {layout.rows};">
    <slot />
  </div>
{:else}
  <div
    class="composite"
    style="grid-area: {area}; --areas: {layout.areas}; --columns: {layout.columns}; --rows: {layout.rows};">
    <slot />
  </div>
{/if}
