<script lang="ts">
  import Menu from "../../components/Menu.svelte";
  import Balance from "../../components/Balance.svelte";
  import Transactions from "../../components/Transactions.svelte";
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 200px auto 80px;
  }
</style>

<div
  class="flex flex-col items-center justify-center h-full bg-white bg-center bg-cover"
  style="background-image: url(/images/background.webp)">
  <div
    class="justify-center w-full h-full max-w-lg bg-white shadow-2xl wrap md:m-12"
    style="position:relative;max-height: 900px">
    <div class="grid h-full">
      <Balance></Balance>

      <main class="overflow-y-scroll bg-gray-100">
        <Transactions></Transactions>
      </main>
      <Menu />
    </div>
  </div>
</div>
