<script lang="ts">
  import "css-doodle";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  // import { MamaOmo, SpanishMamaOmo } from "src/libs/mama-omo";

  // function clickMe() {
  //   new MamaOmo("Samuel").greetMe();
  // }
  $: safeAddress = "";

  onMount(() => {
    safeAddress = localStorage.getItem("omo.safeAddress");
    if (safeAddress) {
      push("/omo/dapps");
    }
  });
</script>

<div class="flex items-center justify-center h-full bg-light-100">
  <div class="">
    <img src="images/logo/logo.svg" alt="omo" class="w-1/3 mx-auto" />
    <div
      class="mx-auto text-xl text-center text-secondary font-title max-w-4/5">
      empowering your abundance
    </div>
  </div>
</div>
