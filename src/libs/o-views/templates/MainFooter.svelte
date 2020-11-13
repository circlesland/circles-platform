<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr auto;
  }
</style>

<div class="grid h-full overflow-hidden bg-light-100">
  <slot name="main" />
  <slot name="footer" />
</div>
