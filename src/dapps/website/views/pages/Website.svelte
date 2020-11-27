<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  $: safeAddress = "";

  onMount(() => {
    safeAddress = localStorage.getItem("omo.safeAddress");
    if (safeAddress) {
      push("/omo/dapps");
    }
  });
</script>

<Compose rows="1fr" columns="1fr" tw="items-center justify-center">
  <Compose rows="1fr" columns="1fr">
    <img src="images/logo/logo.svg" alt="omo" class="w-1/3 mx-auto" />
    <div
      class="mx-auto text-xl text-center text-secondary font-title max-w-4/5">
      empowering your abundance
    </div>
  </Compose>
</Compose>
