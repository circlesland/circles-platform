<script lang="ts">
  import MobileLayout from "src/libs/o-views/templates/MobileLayout.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Tokens from "src/dapps/wallet/components/Tokens.svelte";
  import HeaderMainFooter from "src/libs/o-views/templates/HeaderMainFooter.svelte";

  export let params = {};

  let address: string = null;

  $: {
    if (params.address) {
      address = params.address;
    }
  }
  let header = {
    title: "Tokens",
  };
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr;
  }
</style>

<MobileLayout>
  <HeaderMainFooter>
    <headre slot="header">
      <Header data={header} />
    </headre>
    <main slot="main" class="grid overflow-hidden">
      <main
        class="h-full pt-4 overflow-x-hidden overflow-y-scroll bg-gray-100 ">
        <Tokens {address} />
      </main>
    </main>
    <footer slot="footer">
      <Menu {address} actions={Actions} />
    </footer>
  </HeaderMainFooter>
</MobileLayout>
