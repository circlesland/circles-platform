<script>
  import CharacterList from "src/dapps/omo-li/components/CharacterList.svelte";
  import { addMessages, init } from "svelte-i18n";
  import { _ } from "svelte-i18n";

  import en from "src/dapps/omo-li/languages/en.json";
  import de from "src/dapps/omo-li/languages/de.json";
  addMessages("en", en);
  addMessages("de", de);

  init({
    initialLocale: "de",
  });
</script>

<h1 class="title">{$_('app_title')}</h1>

<h2 class="subtitle">{$_('app_slogan')}</h2>

<!-- <CharacterList /> -->
