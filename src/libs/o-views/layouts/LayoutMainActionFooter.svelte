<style>
  .layout {
    display: grid;
    grid-template-rows: 1fr auto 68px;
    height: 100%;
    overflow: hidden;
  }
</style>

<div class="layout">
  <slot name="main" />
  <slot name="action" />
  <slot name="footer" />
</div>
