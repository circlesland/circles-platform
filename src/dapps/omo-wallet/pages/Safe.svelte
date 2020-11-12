<script lang="ts">
  import MobileLayout from "src/libs/o-views/templates/MobileLayout.svelte";
  import TemplatetNavBottom from "src/libs/o-views/templates/TopMainFooter.svelte";

  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Balance from "src/dapps/omo-wallet/components/Balance.svelte";
  import Transactions from "src/dapps/omo-wallet/components/Transactions.svelte";
  import Actions from "src/dapps/omo-wallet/menus/Actions.svelte";
  import Account from "src/dapps/omo-wallet/components/Account.svelte";

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
    grid-template-rows: 150px 60px 1fr;
  }
</style>

<MobileLayout>
  <TemplatetNavBottom>
    <div slot="content" class="grid overflow-hidden">
      <Balance {address} />
      <Account {address} />
      <div class="overflow-x-hidden overflow-y-scroll bg-gray-100">
        <Transactions {address} />
      </div>
    </div>
    <div slot="nav">
      <Menu {address} actions={Actions} />
    </div>
  </TemplatetNavBottom>
</MobileLayout>
