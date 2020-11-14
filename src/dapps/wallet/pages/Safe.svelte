<script lang="ts">
  import LayoutMobileWrapper from "src/libs/o-views/layouts/LayoutMobileWrapper.svelte";
  import LayoutHeaderMainFooter from "src/libs/o-views/layouts/LayoutHeaderMainFooter.svelte";
  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Balance from "src/dapps/wallet/components/Balance.svelte";
  import Transactions from "src/dapps/wallet/components/Transactions.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Account from "src/dapps/wallet/components/Account.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import LayoutHeaderMain from "src/libs/o-views/layouts/LayoutHeaderMain.svelte";
  import LayoutFull from "src/libs/o-views/layouts/LayoutFull.svelte";

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

<!-- <LayoutMobileWrapper> -->
<LayoutHeaderMainFooter>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">
    <LayoutFull>
      <div class="overflow-y-scroll bg-red-500">
        <div class="py-24 m-4 bg-green-400">test</div>
        <div class="py-24 m-4 bg-green-400">test</div>
        <div class="py-24 m-4 bg-green-400">test</div>
        <div class="py-24 m-4 bg-green-400">test</div>

        <!-- <Transactions {address} /> -->
      </div>
    </LayoutFull>
    <!-- <LayoutHeaderMain>
      <div slot="header" class="pt-2 bg-primary">
        <Account {address} />
        <Balance {address} />
      </div>
      <div slot="main" class="overflow-y-scroll bg-light-100">
        <Transactions {address} />
      </div>
    </LayoutHeaderMain> -->
  </main>
  <footer slot="footer">
    <Menu {address} actions={Actions} />
  </footer>
</LayoutHeaderMainFooter>
<!-- </LayoutMobileWrapper> -->
