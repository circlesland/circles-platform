<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  import dayjs from "dayjs";

  import Header from "src/libs/o-views/molecules/Header.svelte";
  import TemplateHeaderMainActionFooter from "src/libs/o-views/templates/TemplateHeaderMainActionFooter.svelte";

  let safeOwner: string;
  let safeAddress: string;
  let lastSuccessfulUbiRetrieval: string;
  let nextPossibleUbiRetrieval: string;

  safeOwner = localStorage.getItem("omo.address");
  safeAddress = localStorage.getItem("omo.safeAddress");
  lastSuccessfulUbiRetrieval = localStorage.getItem(
    "omo.ubiService.lastSuccessfulUbiRetrieval"
  );
  nextPossibleUbiRetrieval = localStorage.getItem(
    "omo.ubiService.nextPossibleUbiRetrieval"
  );

  function logout() {
    localStorage.removeItem("omo.address");
    localStorage.removeItem("omo.safeAddress");
    localStorage.removeItem("omo.privateKey");
    push("/");
  }

  onMount(() => {
    safeAddress = localStorage.getItem("omo.safeAddress");
    if (safeAddress) {
      push("/identity/settings");
    } else {
      push("/wallet/connect");
    }
  });
  let header = {
    title: "Settings",
  };
</script>

<TemplateHeaderMainActionFooter>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">
    <div class="text-lg">Localstorage Data</div><br />
    <div class="uppercase">SafeOwner:</div>
    <p>
      {#if safeOwner}{safeOwner}{/if}
    </p><br />
    <div class="uppercase">GnosisSafe Address:</div>
    <p>
      {#if safeAddress}{safeAddress}{/if}
    </p>
    <br />
    <div class="uppercase">Next Possible Ubi Call:</div>
    <p>
      {#if nextPossibleUbiRetrieval}
        {dayjs(nextPossibleUbiRetrieval).fromNow()}
      {/if}
    </p>
    <br />
    <div class="uppercase">Last Successfull Ubi Call:</div>
    <p>
      {#if lastSuccessfulUbiRetrieval}
        {dayjs(lastSuccessfulUbiRetrieval).fromNow()}
      {/if}
    </p>
  </main>
  <aside slot="action" />
  <footer slot="footer">
    <div
      class="flex justify-center w-full h-full p-3 space-x-3 text-center border-t border-gray-300">
      <a
        href="#/omo/dapps"
        class="px-4 py-2 font-bold uppercase bg-gray-200 border rounded border-light-400 text-primary"><i
          class="fas fa-arrow-left" /></a>
      <p
        on:click={() => logout()}
        class="w-full px-4 py-2 font-bold text-white uppercase rounded cursor-pointer bg-primary">
        logout
      </p>
    </div>
  </footer>
</TemplateHeaderMainActionFooter>
