<script>
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
  import Composite from "src/libs/o-views/atoms/Composite.svelte";
  import Leaf from "./libs/o-views/atoms/Leaf.svelte";

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

  let layout1 = {
    areas: "'top''bottom'",
    columns: "1fr",
    rows: "1fr 1fr",
  };
  let layout2 = { areas: "'top''bottom'", columns: "1fr", rows: "50px 1fr" };
  let layout3 = { areas: "'full'", columns: "1fr", rows: "1fr " };
</script>

<style>
  .app {
    height: 100%;
    overflow: hidden !important;
    position: relative;
  }
</style>

<Tailwind />

<div class="font-sans app">
  <Composite layout={layout1}>
    <Composite layout={layout1} area="top">
      <Leaf area="top" overflowY>
        <div class="py-16 bg-indigo-500">area B1a</div>
        <div class="py-24 bg-blue-500 ">area B1b</div>
        <div class="py-24 bg-green-500 ">area B1b</div>
        <div class="py-24 bg-green-300 ">area B1b</div>
        <div class="py-24 bg-yellow-300 ">area B1b</div>
        <div class="py-24 bg-orange-300 ">area B1b</div>
        <div class="py-24 bg-red-300 ">area B1b</div>
        <div class="py-24 bg-pink-500 ">area B1b</div>
        <div class="py-24 bg-pink-700 ">area B1b</div>
        <div class="py-24 bg-pink-900 ">area B1b</div>
      </Leaf>
      <Leaf area="bottom" overflowX>
        <div class="flex" style="">
          <div class="w-24 py-16 bg-indigo-500">area B1a</div>
          <div class="w-24 py-24 bg-blue-500 ">area B1b</div>
          <div class="py-24 bg-green-500 ">area B1b</div>
          <div class="py-24 bg-green-300 ">area B1b</div>
          <div class="py-24 bg-yellow-300 ">area B1b</div>
          <div class="py-24 bg-orange-300 ">area B1b</div>
          <div class="py-24 bg-red-300 ">area B1b</div>
          <div class="py-24 bg-pink-500 ">area B1b</div>
          <div class="py-24 bg-pink-700 ">area B1b</div>
          <div class="py-24 bg-pink-900 ">area B1b</div>
        </div>
      </Leaf>
    </Composite>
    <Leaf area="bottom" overflowY>
      <div class="py-16 bg-indigo-500">area B1a</div>
      <div class="py-24 bg-blue-500 ">area B1b</div>
      <div class="py-24 bg-green-500 ">area B1b</div>
      <div class="py-24 bg-green-300 ">area B1b</div>
      <div class="py-24 bg-yellow-300 ">area B1b</div>
      <div class="py-24 bg-orange-300 ">area B1b</div>
      <div class="py-24 bg-red-300 ">area B1b</div>
      <div class="py-24 bg-pink-500 ">area B1b</div>
      <div class="py-24 bg-pink-700 ">area B1b</div>
      <div class="py-24 bg-pink-900 ">area B1b</div>
    </Leaf>
  </Composite>
</div>

<!-- <Router {routes} />  -->
