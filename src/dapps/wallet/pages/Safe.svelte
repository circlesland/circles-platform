<script lang="ts">
  import MobileLayout from "src/libs/o-views/templates/MobileLayout.svelte";
  import HeaderMainFooter from "src/libs/o-views/templates/HeaderMainFooter.svelte";

  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Balance from "src/dapps/wallet/components/Balance.svelte";
  import Transactions from "src/dapps/wallet/components/Transactions.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Account from "src/dapps/wallet/components/Account.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";

  export let params = {};

  let address: string = null;

  $: {
    if (params.address) {
      address = params.address;
    }
  }
  let header = {
    title: "Safe",
  };
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 150px 1fr;
  }
</style>

<MobileLayout>
  <HeaderMainFooter>
    <header slot="header">
      <Header data={header} />
      <Account {address} />
    </header>
    <main slot="main" class="grid overflow-hidden">
      <Balance {address} />
      <div class="overflow-x-hidden overflow-y-scroll bg-light-100">
        <Transactions {address} />
      </div>
    </main>
    <footer slot="footer">
      <Menu {address} actions={Actions} />
    </footer>
  </HeaderMainFooter>
</MobileLayout>
