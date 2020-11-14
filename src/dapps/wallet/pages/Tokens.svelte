<script lang="ts">
  import LayoutMobileWrapper from "src/libs/o-views/layouts/LayoutMobileWrapper.svelte";
  import LayoutHeaderMainFooter from "src/libs/o-views/layouts/LayoutHeaderMainFooter.svelte";

  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Tokens from "src/dapps/wallet/components/Tokens.svelte";

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

<LayoutMobileWrapper>
  <LayoutHeaderMainFooter>
    <header slot="header">
      <Header data={header} />
    </header>
    <main slot="main" class="overflow-y-scroll bg-light-100">
      <Tokens {address} />
    </main>
    <footer slot="footer">
      <Menu {address} actions={Actions} />
    </footer>
  </LayoutHeaderMainFooter>
</LayoutMobileWrapper>
