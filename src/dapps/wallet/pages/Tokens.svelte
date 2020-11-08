<script lang="ts">
  import Menu from "./../../../components/Menu.svelte";
  import Actions from "../menus/Actions.svelte";
  import Balance from "../../../components/Balance.svelte";
  import Tokens from "../../../components/Tokens.svelte";
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr auto;
    position: relative;
  }
</style>

<div
        class="flex flex-col items-center justify-center h-full bg-white bg-center bg-cover"
        style="background-image: url(/images/background.webp)">
  <div
          class="justify-center w-full h-full max-w-lg bg-white shadow-2xl wrap md:m-12"
          style="position:relative;max-height: 900px">
    <div class="grid h-full">
      <Balance />

      <main class="h-full overflow-y-scroll bg-gray-100">
        <Tokens />
      </main>
      <Menu actions={Actions} />
    </div>
  </div>
</div>
