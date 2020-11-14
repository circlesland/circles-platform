<style>
  .layout {
    display: grid;
    grid-template-rows: 10rem 1fr;
    height: 100%;
    overflow: hidden;
  }
</style>

<div class="layout">
  <slot name="header" />
  <slot name="main" />
</div>
