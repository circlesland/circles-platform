<script lang="ts">
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Tokens from "src/dapps/wallet/components/Tokens.svelte";
  import TemplateSafe from "src/libs/o-views/templates/TemplateSafe.svelte";


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

<TemplateSafe>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">
    <Tokens {address} />
  </main>
  <footer slot="footer">
    <Menu {address} actions={Actions} />
  </footer>
</TemplateSafe>
