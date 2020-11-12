<script lang="ts">
  import MobileLayout from "src/libs/o-views/templates/MobileLayout.svelte";
  import HeaderMainFooter from "src/libs/o-views/templates/HeaderMainFooter.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Trusts from "src/dapps/wallet/components/Trusts.svelte";

  export let params = {};

  let header = {
    title: "Friends",
  };

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
    grid-template-rows: 1fr;
  }
</style>

<MobileLayout>
  <HeaderMainFooter>
    <header slot="header">
      <Header data={header} />
    </header>
    <main slot="main" class="grid overflow-hidden">
      <div class="overflow-x-hidden overflow-y-scroll bg-gray-100">
        <Trusts {address} />
      </div>
    </main>
    <footer slot="footer">
      <Menu {address} actions={Actions} />
    </footer>
  </HeaderMainFooter>
</MobileLayout>
