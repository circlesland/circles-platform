<script lang="ts">
  // import Web3 from "web3";
  // import { o, Router } from "@omoearth/o-types";
  // import Route from "../1-Atoms/Route.svelte";
  // import { mnemonicToEntropy } from "bip39";
  // import Web3Provider from "./Web3Provider.svelte";

  // let seedphrase: string;
  // let safeAddress: string;
  // let web3: Web3;

  // function storeInputAndContinue() {
  //   if (!web3) throw new Error("The 'web3' property has no value.");

  //   const privateKey = mnemonicToEntropy(seedphrase);
  //   const ownerAddress = web3.eth.accounts.privateKeyToAccount(privateKey);
  //   localStorage.setItem("omo.privateKey", privateKey);
  //   localStorage.setItem("omo.address", ownerAddress.address);
  //   localStorage.setItem("omo.safeAddress", safeAddress);

  //   Router.navigateTo(o.WALLET, "transactions");
  // }

  // // TODO: Lock controls until the dependency is available
  // function onWeb3(event: { detail: { web3: Web3 } }) {
  //   web3 = event.detail.web3;
  // }
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: 1fr auto;
    position: relative;
  }
</style>

connect
<!-- 
<Web3Provider on:initialized={onWeb3} />

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
            on:click={() => storeInputAndContinue('SAFEADDRESS')}>Store Local</button>
          <button
            class="w-full bg-gray-300 text-primary"
            onclick="storeLocal()">Store Local</button>
        </div>
      </footer>
    </div>
  </div>
</div> -->
