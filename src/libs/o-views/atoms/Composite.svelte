<script lang="ts">
  export let layout = {
    areas: "'main'",
    columns: "1fr",
    rows: "1fr",
  };
  export let area: string = "main";
</script>

<style>
  .composite {
    display: grid;
    grid-template-areas: var(--areas);
    grid-template-columns: var(--columns);
    grid-template-rows: var(--rows);
    overflow: hidden;
    height: 100%;
  }
</style>

<div
  class="composite"
  style="grid-area: {area}; --areas: {layout.areas}; --columns: {layout.columns}; --rows: {layout.rows};">
  <slot />
</div>
