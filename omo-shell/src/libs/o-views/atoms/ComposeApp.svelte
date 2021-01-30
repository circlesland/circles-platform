<script lang="ts">
  export let tw: string = "";
</script>

<style>
  .app {
    overflow: hidden !important;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: minmax(1fr);
    grid-template-columns: minmax(1fr);
    position: absolute;
    overflow: hidden !important;
    touch-action: none;
  }
</style>

<div class="app {tw}">
  <slot />
</div>
