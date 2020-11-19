<script lang="ts">
  export let areas: string = "";
  export let columns: string = "";
  export let rows: string = "";
  export let area: string = "";
  export let gap: string = "";
  export let overflowX: Boolean = false;
  export let overflowY: Boolean = false;
  export let app: boolean = false;
  export let design: string;
</script>

<style>
  .layout {
    display: grid;
    grid-template-areas: var(--areas);
    grid-template-columns: var(--columns);
    grid-template-rows: var(--rows);
    overflow: hidden;
    position: relative;
  }
  .leaf {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    overflow: hidden;
    position: relative;
  }
  .full {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
  .scrollX {
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-overflow-scrolling: touch;
    overflow-x: scroll;
  }
  .scrollY {
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll !important;
  }
</style>

{#if areas || rows || columns}
  {#if app}
    <div
      class="h-full composite  {design}"
      style="grid-area: {area}; --areas: {areas}; --columns: {columns}; --rows: {rows};">
      <slot />
    </div>
  {:else}
    <div
      class="composite {design}"
      style="grid-area: {area}; --areas: {areas}; --columns: {columns}; --rows: {rows};">
      <slot />
    </div>
  {/if}
{:else}
  <div class="leaf full" style="grid-area: {area}">
    {#if overflowX}
      <div class="overflow-y-hidden full scrollX {design}">
        <slot />
      </div>
    {:else if overflowY}
      <div class="overflow-x-hidden full scrollY {design}">
        <slot />
      </div>
    {:else}
      <div class="full {design}">
        <slot />
      </div>
    {/if}
  </div>
{/if}
