<style>
  .grid {
    display: grid;
    grid-template-rows: auto 1fr 68px;
  }
</style>

<div class="grid h-full overflow-hidden">
  <slot name="header" />
  <slot name="main" />
  <slot name="footer" />
</div>
