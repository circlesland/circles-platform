<script lang="ts">
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Trusts from "src/dapps/wallet/components/Trusts.svelte";
  import TemplateSafe from "src/libs/o-views/templates/TemplateSafe.svelte";

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

<TemplateSafe>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">
    <Trusts {address} />
  </main>
  <footer slot="footer">
    <Menu {address} actions={Actions} />
  </footer>
</TemplateSafe>
