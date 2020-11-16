<script lang="ts">
  import { push } from "svelte-spa-router";
  import TemplateHeaderMainActionFooter from "src/libs/o-views/templates/TemplateHeaderMainActionFooter.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";

  let header = {
    title: "Start",
  };
</script>

<TemplateHeaderMainActionFooter>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">Login or create new safe and register</main>
  <aside slot="action" />
  <footer slot="footer">
    <div class="flex w-full h-full p-3 space-x-3 border-t border-gray-300">
      <a
        href="#/omo/dapps"
        class="px-4 py-2 uppercase border border-gray-300 rounded text-primary"><i
          class="fas fa-arrow-left" /></a>
      <a
        href="#/wallet/register"
        class="w-full px-4 py-2 text-center uppercase border rounded cursor-pointer text-primary bg-light-100">
        Register New
      </a>
      <a
        href="#/wallet/connect"
        class="w-full py-2 text-center text-white uppercase rounded cursor-pointer bg-primary">
        Login
      </a>
    </div>
  </footer>
</TemplateHeaderMainActionFooter>
