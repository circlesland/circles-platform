<script lang="ts">
  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Balance from "src/dapps/wallet/components/Balance.svelte";
  import Transactions from "src/dapps/wallet/components/Transactions.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Account from "src/dapps/wallet/components/Account.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import TemplateSafeBalance from "src/libs/o-views/templates/TemplateSafeBalance.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  export let getActions:() => string[];
  export let params = {};

  let mySafeAddress;

  onMount(() => {
    mySafeAddress = localStorage.getItem("omo.safeAddress");
    if (!mySafeAddress) {
      push("/wallet/connect");
    }
  });

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

<TemplateSafeBalance>
  <header slot="header">
    <Header data={header} />
  </header>
  <div slot="balance">
    <Balance {address} />
  </div>
  <div slot="address">
    <Account {address} />
  </div>
  <main slot="main">
    <Transactions {address} />
  </main>
  <footer slot="footer">
    <Menu {address} actions={Actions} />
  </footer>
</TemplateSafeBalance>
