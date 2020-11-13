<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "src/routes";
  import Tailwind from "src/Tailwind.svelte";
  import { getLocaleFromNavigator, addMessages, init } from "svelte-i18n";
  import { _ } from "svelte-i18n";

  import omo_en from "src/dapps/omo/languages/en.json";
  import omo_de from "src/dapps/omo/languages/de.json";

  import website_en from "src/dapps/website/languages/en.json";
  import website_de from "src/dapps/website/languages/de.json";
  import wallet_de from "src/dapps/wallet/languages/de.json";
  import wallet_en from "src/dapps/wallet/languages/en.json";
  import identity_de from "src/dapps/identity/languages/de.json";
  import identity_en from "src/dapps/identity/languages/en.json";

  let notes_en = {
    notes_text:
      "This dapp is an early alpha test version. For feedback join our",
    notes_button: "chat",
  };
  let notes_de = {
    notes_text:
      "Diese App is noch in früher Testphase. Für Feedback schreib uns im",
    notes_button: "chat",
  };

  addMessages("en", omo_en, website_en, notes_en, wallet_en, identity_en);
  addMessages("de", omo_de, website_de, notes_de, wallet_de, identity_de);

  init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator(),
  });
</script>

<style>
  .app {
    display: grid;
    grid-template-rows: 1fr;
    height: 100%;
    overflow: hidden;
  }
</style>

<Tailwind />
<div class="font-sans app">
  <Router {routes} />
</div>
