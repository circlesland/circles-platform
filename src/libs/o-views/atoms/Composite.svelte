<script lang="ts">
  import { Layout } from "src/libs/o-types";
  export let layout: Layout;
  export let area: string = "";
  export let m: string = "0";
  export let p: string = "0";
  export let bg: string = "";
  export let space: string = "space-y-0 space-x-0";

  // Fix iOS body scroll bumps and overflow issues
  var scrollX = 0;
  var scrollY = 0;
  var scrollMinX = 0;
  var scrollMinY = 0;
  var scrollMaxX = document.body.scrollWidth - window.innerWidth;
  var scrollMaxY = document.body.scrollHeight - window.innerHeight;

  // make sure that we work with the correct dimensions
  window.addEventListener(
    "resize",
    function () {
      scrollMaxX = document.body.scrollWidth - window.innerWidth;
      scrollMaxY = document.body.scrollHeight - window.innerHeight;
    },
    false
  );

  // where the magic happens
  window.addEventListener(
    "scroll",
    function () {
      scrollX = window.scrollX;
      scrollY = window.scrollY;

      if (scrollX <= scrollMinX) scrollTo(scrollMinX, window.scrollY);
      if (scrollX >= scrollMaxX) scrollTo(scrollMaxX, window.scrollY);

      if (scrollY <= scrollMinY) scrollTo(window.scrollX, scrollMinY);
      if (scrollY >= scrollMaxY) scrollTo(window.scrollX, scrollMaxY);
    },
    false
  );
</script>

<style>
  .composite {
    display: grid;
    grid-template-areas: var(--areas);
    grid-template-columns: var(--columns);
    grid-template-rows: var(--rows);
    overflow: hidden;
    position: relative;
  }
</style>

{#if area == ''}
  <div
    class="h-full composite {m} {p} {bg} {space}"
    style="grid-area: {area}; --areas: {layout.areas}; --columns: {layout.columns}; --rows: {layout.rows};">
    <slot />
  </div>
{:else}
  <div
    class="composite {m} {p} {bg} {space}"
    style="grid-area: {area}; --areas: {layout.areas}; --columns: {layout.columns}; --rows: {layout.rows};">
    <slot />
  </div>
{/if}
