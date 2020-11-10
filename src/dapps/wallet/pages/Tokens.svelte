<script lang="ts">
  import PageTransition from "./../../../transitions/PageTransition.svelte";
  import MobileLayout from "../../../layouts/MobileLayout.svelte";

  import Menu from "../../../components/Menu.svelte";
  import Actions from "../menus/Actions.svelte";
  import Tokens from "../components/Tokens.svelte";

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
    grid-template-rows: 40px 1fr auto;
  }
</style>

<MobileLayout>
  <PageTransition>
    <div class="grid h-full">
      <header
        class="px-3 py-2 font-bold bg-white border-b border-gray-300 text-primary">
        Circles token balances
      </header>
      <main class="pt-4 overflow-x-hidden overflow-y-scroll bg-gray-100">
        <Tokens {address} />
      </main>
      <Menu {address} actions={Actions} />
    </div>
  </PageTransition>
</MobileLayout>
