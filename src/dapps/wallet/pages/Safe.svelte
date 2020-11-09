<script lang="ts">
  import Menu from "../../../components/Menu.svelte";
  import Balance from "../components/Balance.svelte";
  import Transactions from "../components/Transactions.svelte";
  import Actions from "../menus/Actions.svelte";
  import Account from "../components/Account.svelte";


  export let params = {}

  let address:string = null;

  $:{
    if (params.address)
    {
      address = params.address;
    }
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 200px 1fr auto;
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
      <Account {address} />
      <Balance {address} />
      <main class="h-full overflow-y-scroll bg-gray-100">
        <Transactions {address} />
      </main>
      <Menu {address} actions={Actions} />
    </div>
  </div>
</div>
