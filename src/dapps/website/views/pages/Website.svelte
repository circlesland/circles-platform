<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";

  $: safeAddress = "";

  onMount(() => {
    safeAddress = localStorage.getItem("omo.safeAddress");
    if (safeAddress) {
      push("/omo/dapps");
    }
  });
</script>

<div class="flex items-center justify-center">
  <div class="">
    <img src="images/logo/logo.svg" alt="omo" class="w-1/3 mx-auto" />
    <div
      class="mx-auto text-xl text-center text-secondary font-title max-w-4/5">
      empowering your abundance
    </div>
  </div>
</div>
