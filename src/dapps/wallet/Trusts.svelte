<script lang="ts">
  import Menu from "./../../components/Menu.svelte";
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: auto 80px;
  }
</style>

<div
  class="flex flex-col items-center justify-center h-full bg-white bg-center bg-cover"
  style="background-image: url(/images/background.webp)">
  <div
    class="justify-center w-full h-full max-w-lg bg-white shadow-2xl wrap md:m-12"
    style="position:relative;max-height: 900px">
    <div class="grid h-full">
      <div>Trusts</div>
      <Menu />
    </div>
  </div>
</div>
