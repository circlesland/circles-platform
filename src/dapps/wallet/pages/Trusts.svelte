<script lang="ts">
  import LayoutMobileWrapper from "src/libs/o-views/layouts/LayoutMobileWrapper.svelte";
  import LayoutHeaderMainFooter from "src/libs/o-views/layouts/LayoutHeaderMainFooter.svelte";
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

<LayoutMobileWrapper>
  <LayoutHeaderMainFooter>
    <header slot="header">
      <Header data={header} />
    </header>
    <main slot="main" class="overflow-y-scroll bg-light-100">
      <Trusts {address} />
    </main>
    <footer slot="footer">
      <Menu {address} actions={Actions} />
    </footer>
  </LayoutHeaderMainFooter>
</LayoutMobileWrapper>
