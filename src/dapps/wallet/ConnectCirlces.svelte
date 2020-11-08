<script lang="ts">
  import { mnemonicToEntropy } from "bip39";
  import {config} from "../../libs/o-circles-protocol/config";
  import {push} from 'svelte-spa-router'

  let seedphrase: string;
  let safeAddress: string;

  function storeInputAndContinue() {
    const privateKey = mnemonicToEntropy(seedphrase);
    const ownerAddress = config.getCurrent().web3().eth.accounts.privateKeyToAccount(privateKey);
    localStorage.setItem("omo.privateKey", privateKey);
    localStorage.setItem("omo.address", ownerAddress.address);
    localStorage.setItem("omo.safeAddress", safeAddress);

    push('/wallet/safe');
  }
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
          Connect Circle Seed
        </h1>
        <p class="py-4 text-sm text-center text-gray-700">
          Store with textile or only in localstore
        </p>
      </main>

      <footer class="p-4 border-t border-gray-300">
        <div>
          <p class="mb-1 text-xs text-gray-700 uppercase">
            Enter seedphrase to recover
          </p>
          <input
            placeholder="Your safe address"
            class="w-full h-24 p-2 mb-2 bg-transparent border border-gray-300 rounded text-primary"
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
            class="w-full bg-gray-300 text-primary"
            on:click={() => storeInputAndContinue()}>Store Local</button>
        </div>
      </footer>
    </div>
  </div>
</div>
