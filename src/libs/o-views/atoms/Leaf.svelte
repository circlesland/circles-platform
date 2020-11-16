<script lang="ts">
  export let area: string = "";
  export let m: string = "0";
  export let p: string = "0";
  export let bg: string = "";
  export let space: string = "";
  export let overflowX: Boolean = false;
  export let overflowY: Boolean = false;
</script>

<style>
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
  .leaf {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    overflow: hidden;
    max-width: 100%;
    position: relative;
  }
  .fullgrid {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
</style>

<div class="leaf" style="grid-area: {area}">
  {#if overflowX}
    <div class="fullgrid scrollX overflow-y-hidden {m} {p} {bg} {space} ">
      <slot />
    </div>
  {:else if overflowY}
    <div class="fullgrid scrollY overflow-x-hidden {m} {p} {bg} {space} ">
      <slot />
    </div>
  {:else}
    <div class="fullgrid {m} {p} {bg} {space} ">
      <slot />
    </div>
  {/if}
</div>
