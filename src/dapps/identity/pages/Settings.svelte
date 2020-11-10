<script lang="ts">
  import { onMount } from "svelte";
  import MobileLayout from "../../../templates/MobileLayout.svelte";
  import { push } from "svelte-spa-router";

  import dayjs from "dayjs";
  import PageTransition from "../../../transitions/PageTransition.svelte";

  let safeOwner: string;
  let safeAddress: string;
  let privateKey: string;
  let lastUbiRetrieval: string;
  let lastSuccessfulUbiRetrieval: string;
  let nextPossibleUbiRetrieval: string;

  safeOwner = localStorage.getItem("omo.address");
  safeAddress = localStorage.getItem("omo.safeAddress");
  privateKey = localStorage.getItem("omo.privateKey");
  lastUbiRetrieval = localStorage.getItem("omo.lastUbiRetrieval");
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
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr auto;
  }
</style>

<MobileLayout>
  <PageTransition>
    <div class="grid w-full h-full">
      <div class="mx-6 my-4 overflow-x-hidden">
        <h1 class="text-xl">My Odentity</h1>
        <div class="text-lg">Localstorage Data</div><br />
        <div class="uppercase">SafeOwner:</div>
        <p>
          {#if safeOwner}{safeOwner}{/if}
        </p><br />
        <div class="uppercase">PrivateKey:</div>
        <p>
          {#if privateKey}{privateKey}{/if}
        </p>
        <br />
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
      </div>
      <div
        class="flex justify-center w-full p-4 space-x-3 text-center border-t border-gray-300">
        <a
          href="#/dapps"
          class="w-full px-4 py-2 font-bold uppercase bg-gray-300 rounded text-primary">back</a>
        <div
          on:click={() => logout()}
          class="w-full px-4 py-2 font-bold text-white uppercase bg-pink-800 rounded">
          logout
        </div>
      </div>
    </div>
  </PageTransition>
</MobileLayout>
