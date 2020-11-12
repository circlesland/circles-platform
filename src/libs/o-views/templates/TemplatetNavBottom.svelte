<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr 68px;
  }
</style>

<div class="grid h-full overflow-hidden">
  <slot name="content" />
  <slot name="nav" />
</div>
