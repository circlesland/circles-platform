<script lang="ts">
  import MobileLayout from "src/libs/o-views/templates/MobileLayout.svelte";
  import MainFooter from "src/libs/o-views/templates/MainFooter.svelte";
  import { mnemonicToEntropy } from "bip39";
  import { config } from "src/libs/o-circles-protocol/config";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import TemplateHeaderMainActionFooter from "src/libs/o-views/templates/TemplateHeaderMainActionFooter.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import {connectSafe} from "../processes/connectSafe/connectSafe";

  let seedphrase: string;
  let safeAddress: string;

  let process = connectSafe;

  function createNewAccount()
  {
    push("/wallet/register");
  }

  function storeInputAndContinue()
  {
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

  onMount(() =>
  {
    safeAddress = localStorage.getItem("omo.safeAddress");
    if (safeAddress)
    {
      push("/wallet/" + safeAddress + "/safe");
    }
  });
  let header = {
    title: "Connect Circles",
  };
</script>

<TemplateHeaderMainActionFooter>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">
      <h1 class="text-3xl text-center font-title text-primary">
        Connect your Circles account
      </h1>
      <p class="py-4 text-sm text-center text-gray-700">
        This is a non-custodial wallet, your private key will be stored in your
        browsers localstorage
      </p>
    </main>
    <footer slot="footer" class="p-4 bg-white border-t">
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
      <div class="flex space-x-4">
        <a
          href="#/omo/dapps"
          class="px-4 py-2 uppercase border border-gray-300 rounded text-primary"><i
            class="fas fa-arrow-left" /></a>
        <div
          class="w-full py-2 text-center text-white uppercase rounded cursor-pointer bg-primary"
          on:click={() => storeInputAndContinue()}>
          Login
        </div>
      </div>
    </footer>
</TemplateHeaderMainActionFooter>
