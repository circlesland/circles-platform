<script lang="ts">
  import PageTransition from "../../../transitions/PageTransition.svelte";
  import MobileLayout from "../../../templates/MobileLayout.svelte";
  import TemplatetNavBottom from "src/templates/TemplatetNavBottom.svelte";

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
