<script lang="ts">
  export let areas: string = "";
  export let columns: string = "";
  export let rows: string = "";
  export let area: string = "";
  export let gap: string = "";
  export let overflowX: Boolean = false;
  export let overflowY: Boolean = false;
  export let tw: string;
</script>

<style>
  .compose {
    display: grid;
    grid-template-areas: var(--areas);
    grid-template-columns: var(--columns);
    grid-template-rows: var(--rows);
    grid-gap: var(--gap);
    position: relative;
  }
  .area {
    grid-area: var(--area);
    display: grid;
    grid-template-rows: minmax(1fr);
    grid-template-columns: minmax(1fr);
    overflow: hidden !important;
    position: relative;
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

  .noArea {
    display: grid;
    grid-template-rows: minmax(1fr);
    grid-template-columns: minmax(1fr);
    overflow: hidden !important;
    position: relative;
  }
</style>

{#if area}
  <div class="area" style="--area:{area};">
    {#if overflowX}
      <div
        class="overflow-y-hidden compose scrollX {tw}"
        style="--areas:'{areas}'; --columns:{columns}; --rows:{rows}; --gap:{gap};">
        <slot />
      </div>
    {:else if overflowY}
      <div
        class="overflow-x-hidden compose scrollY {tw}"
        style="--areas:'{areas}'; --columns:{columns}; --rows:{rows}; --gap:{gap};">
        <slot />
      </div>
    {:else}
      <div
        class="overflow-hidden compose {tw}"
        style="--areas:'{areas}'; --columns:{columns}; --rows:{rows}; --gap:{gap};">
        <slot />
      </div>
    {/if}
  </div>
{:else}
  <div class="noArea">
    {#if overflowX}
      <div
        class="overflow-y-hidden compose scrollX {tw}"
        style="--areas:{areas}; --columns:{columns}; --rows:{rows}; --gap:{gap};">
        <slot />
      </div>
    {:else if overflowY}
      <div
        class="overflow-x-hidden compose scrollY {tw}"
        style="--areas:{areas}; --columns:{columns}; --rows:{rows}; --gap:{gap};">
        <slot />
      </div>
    {:else}
      <div
        class="overflow-hidden compose {tw}"
        style="--areas:{areas}; --columns:{columns}; --rows:{rows}; --gap:{gap};">
        <slot />
      </div>
    {/if}
  </div>
{/if}
