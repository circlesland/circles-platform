<script lang="ts">
  import { mnemonicToEntropy } from "bip39";
  import { config } from "src/libs/o-circles-protocol/config";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import TemplateHeaderMainActionFooter from "src/libs/o-views/templates/TemplateHeaderMainActionFooter.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";

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
  <aside slot="action">
    <div>
      <p class="p-1 text-xs text-gray-600">Enter safeaddress to recover</p>
      <input
        placeholder="Your safe address"
        type="text"
        class="w-full p-2 mb-2 bg-transparent bg-white border border-gray-300 rounded text-primary"
        bind:value={safeAddress} />
    </div>
    <div>
      <p class="p-1 text-xs text-gray-600">Enter seedphrase to recover</p>
      <textarea
        placeholder="word1 word2 word3 word4 .... word23 word24"
        class="w-full h-24 p-2 bg-transparent bg-white border border-gray-300 rounded text-primary"
        bind:value={seedphrase} />
    </div>
  </aside>
  <footer slot="footer">
    <div class="flex w-full h-full p-3 space-x-3 border-t border-gray-300">
      <a
        href="#/omo/dapps"
        class="px-4 py-2 font-bold uppercase bg-gray-200 border rounded border-light-400 text-primary"><i
          class="fas fa-arrow-left" /></a>
      <div
        class="w-full py-2 text-center text-white uppercase rounded cursor-pointer bg-primary"
        on:click={() => storeInputAndContinue()}>
        Login
      </div>
    </div>
  </footer>
</TemplateHeaderMainActionFooter>