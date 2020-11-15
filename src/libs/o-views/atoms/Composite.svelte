<script lang="ts">
  import { Layout } from "src/libs/o-types";
  export let layout: Layout;
  export let area: string = "";
  export let m: string = "0";
  export let p: string = "0";
  export let bg: string = "";
  export let space: string = "space-y-0 space-x-0";
</script>

<style>
  .composite {
    display: grid;
    grid-template-areas: var(--areas);
    grid-template-columns: var(--columns);
    grid-template-rows: var(--rows);
    overflow: hidden;
    position: relative;
  }
</style>

{#if area == ''}
  <div
    class="h-full composite {m} {p} {bg} {space}"
    style="grid-area: {area}; --areas: {layout.areas}; --columns: {layout.columns}; --rows: {layout.rows};">
    <slot />
  </div>
{:else}
  <div
    class="composite {m} {p} {bg} {space}"
    style="grid-area: {area}; --areas: {layout.areas}; --columns: {layout.columns}; --rows: {layout.rows};">
    <slot />
  </div>
{/if}
