<script lang="ts">
  import { mnemonicToEntropy } from "bip39";
  import { config } from "src/libs/o-circles-protocol/config";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import { connectSafe } from "../processes/connectSafe/connectSafe";
  import Process from "../../../libs/o-views/molecules/Process.svelte";
  import TemplateHeaderMainAction from "src/libs/o-views/templates/TemplateHeaderMainAction.svelte";
  import TemplateHeaderMainActionFooter from "src/libs/o-views/templates/TemplateHeaderMainActionFooter.svelte";



  let seedphrase: string;
  let safeAddress: string;

  let process = connectSafe;

  function createNewAccount() {
    push("/wallet/register");
  }

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

<TemplateHeaderMainAction>
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
      <Process on:stopped={() => (process = null)} definition={process} />
    </div>
  </aside>
  <!-- <footer slot="footer" class="p-4 bg-white border-t">
    <div class="flex space-x-4">
      <a
        href="#/omo/dapps"
        class="px-4 py-2 uppercase border border-gray-300 rounded text-primary"><i
          class="fas fa-arrow-left" /></a>
      <a
        href="#/wallet/register"
        class="w-full px-4 py-2 text-center uppercase border rounded cursor-pointer text-primary bg-light-100">
        Register
      </a>
      <div
        class="w-full py-2 text-center text-white uppercase rounded cursor-pointer bg-primary"
        on:click={() => storeInputAndContinue()}>
        Login
      </div>
    </div>
  </footer> -->
</TemplateHeaderMainAction>
