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

  addMessages("en", omo_en, website_en);
  addMessages("de", omo_de, website_de);

  init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator(),
  });
</script>

<Tailwind />
<div class="h-full font-sans">
  <Router {routes} />
</div>
