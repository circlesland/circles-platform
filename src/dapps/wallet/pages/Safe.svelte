<script lang="ts">
  import Balance from "src/dapps/wallet/components/Balance.svelte";
  import Transactions from "src/dapps/wallet/components/Transactions.svelte";
  import Account from "src/dapps/wallet/components/Account.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import TemplateSafeBalance from "src/libs/o-views/templates/TemplateSafeBalance.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  let address = localStorage.getItem("omo.safeAddress");

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
</TemplateSafeBalance>
