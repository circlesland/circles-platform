<script lang="ts">
  import { mnemonicToEntropy } from "bip39";
  import { config } from "../../../libs/o-circles-protocol/config";
  import { loc, push } from "svelte-spa-router";
  import { onMount } from "svelte";

  let seedphrase: string;
  let safeAddress: string;

  function storeInputAndContinue() {
    const privateKey = mnemonicToEntropy(seedphrase);
    const ownerAddress = config
      .getCurrent()
      .web3()
      .eth.accounts.privateKeyToAccount(privateKey);

    localStorage.setItem("omo.privateKey", "0x" + privateKey);
    localStorage.setItem("omo.address", ownerAddress.address);
    localStorage.setItem("omo.safeAddress", safeAddress);

    push("/wallet/" + safeAddress + "/safe");
  }

  onMount(() => {
    safeAddress = localStorage.getItem("omo.safeAddress");
    if (safeAddress) {
      push("/wallet/" + safeAddress + "/safe");
    }
  });
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr auto;
    position: relative;
  }
</style>

<div
  class="flex flex-col items-center justify-center h-full bg-white bg-center bg-cover"
  style="background-image: url(/images/background.webp)">
  <div
    class="justify-center w-full h-full max-w-lg bg-white shadow-2xl wrap md:m-12"
    style="position:relative;max-height: 900px">
    <div class="grid h-full">
      <main class="h-full p-8 overflow-y-scroll text-center bg-gray-100">
        <h1 class="text-3xl text-center font-title text-primary">
          Connect your Circles account
        </h1>
        <p class="py-4 text-sm text-center text-gray-700">
          This is a non-custodial wallet, your private key will be stored in
          your browsers localstorage
        </p>
      </main>

      <footer class="p-4 border-t border-gray-300">
        <div>
          <p class="mb-1 text-xs text-gray-700 uppercase">
            Enter safeaddress to recover
          </p>
          <input
            placeholder="Your safe address"
            type="text"
            class="w-full p-2 mb-2 bg-transparent border border-gray-300 rounded text-primary"
            bind:value={safeAddress} />
        </div>
        <div>
          <p class="mb-1 text-xs text-gray-700 uppercase">
            Enter seedphrase to recover
          </p>
          <textarea
            placeholder="word1 word2 word3 word4 .... word23 word24"
            class="w-full h-24 p-2 mb-2 bg-transparent border border-gray-300 rounded text-primary"
            bind:value={seedphrase} />
        </div>
        <div class="flex">
          <button
            class="w-full py-2 text-white uppercase rounded bg-primary font-title"
            on:click={() => storeInputAndContinue()}>Login</button>
        </div>
      </footer>
    </div>
  </div>
</div>
