<script lang="ts">
  import PageTransition from "../../../transitions/PageTransition.svelte";
  import MobileLayout from "../../../layouts/MobileLayout.svelte";

  import Menu from "../../../components/Menu.svelte";
  import Balance from "../components/Balance.svelte";
  import Transactions from "../components/Transactions.svelte";
  import Actions from "../menus/Actions.svelte";
  import Account from "../components/Account.svelte";

  export let params = {};

  let address: string = null;

  $: {
    if (params.address) {
      address = params.address;
    }
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 150px 60px 1fr auto;
  }
</style>

<MobileLayout>
  <PageTransition>
    <div class="grid h-full">
      <Balance {address} />
      <Account {address} />
      <main class="overflow-x-hidden overflow-y-scroll bg-gray-100">
        <Transactions {address} />
      </main>
      <Menu {address} actions={Actions} />
    </div>
  </PageTransition>
</MobileLayout>
