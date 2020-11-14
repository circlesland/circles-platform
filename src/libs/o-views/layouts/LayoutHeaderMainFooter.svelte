<style>
  .layout {
    display: grid;
    grid-template-rows: 30px 1fr 68px;
    height: 100%;
    overflow: hidden;
  }
</style>

<div class="layout">
  <slot name="header" />
  <slot name="main" />
  <slot name="footer" />
</div>
