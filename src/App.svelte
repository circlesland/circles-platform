<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "src/routes";
  import Tailwind from "src/Tailwind.svelte";
  import { addMessages, init } from "svelte-i18n";
  import { _ } from "svelte-i18n";

  import en from "src/dapps/omo/languages/en.json";
  import de from "src/dapps/omo/languages/de.json";

  addMessages("en", en);
  addMessages("de", de);

  init({
    initialLocale: "en",
  });
</script>

<Tailwind />
<div class="h-full font-sans">
  <Router {routes} />
</div>
