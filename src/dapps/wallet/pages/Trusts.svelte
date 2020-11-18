<script lang="ts">
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Menu from "src/libs/o-views/molecules/Menu.svelte";
  import Actions from "src/dapps/wallet/menus/Actions.svelte";
  import Trusts from "src/dapps/wallet/components/Trusts.svelte";
  import TemplateSafe from "src/libs/o-views/templates/TemplateSafe.svelte";

  let header = {
    title: "Friends",
  };
</script>

<TemplateSafe>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">
    <Trusts />
  </main>
  <footer slot="footer">
    <Menu actions={Actions} />
  </footer>
</TemplateSafe>
