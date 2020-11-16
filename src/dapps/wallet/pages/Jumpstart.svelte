<script lang="ts">
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import Process from "../../../libs/o-views/molecules/Process.svelte";
  import { ProcessContext } from "../../../libs/o-processes/processContext";
  import { transferXDai } from "../processes/transferXDai/transferXDai";
  import { BN } from "ethereumjs-util";
  import { config } from "../../../libs/o-circles-protocol/config";
  import TemplateHeaderMainActionFooter from "src/libs/o-views/templates/TemplateHeaderMainActionFooter.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import { jumpstart } from "../processes/jumpstart/jumpstart";

  // http://localhost:5000/#/wallet/jumpstart/0x9B74661e83F6696AdF872576f886Dc5Eb569B0bD

  export let params = {};

  let mySafeAddress: string;

  onMount(() => {
    mySafeAddress = localStorage.getItem("omo.safeAddress");
    if (!mySafeAddress) {
      push("/wallet/connect");
    }
  });

  /**
   * The address that should be funded
   */
  let address: string = null;
  let contextInitializer;

  $: {
    if (params.address) {
      address = params.address;
      contextInitializer = (processContext: ProcessContext) => {
        const transferXDaiContext = {
          ...processContext,
          transfer: {
            recipient: {
              type: "ethereumAddress",
              data: params.address,
            },
            value: {
              type: "wei",
              data: config.getCurrent().JUMPSTART_MONEY,
            },
          },
        };
        return transferXDaiContext;
      };
    }
  }
  $: {
    if (params.address) {
      address = params.address;
      contextInitializer = (processContext: ProcessContext) => {
        const jumpstartContext = {
          ...processContext,
          jumpstart: {
            recipient: {
              type: "ethereumAddress",
              data: params.address,
            },
          },
        };
        return jumpstartContext;
      };
    }
  }

  let process;

  function yes() {
    process = jumpstart;
  }

  function no() {
    push("/wallet/" + mySafeAddress + "/safe");
  }

  let header = {
    title: "Jump start",
  };
</script>

<TemplateHeaderMainActionFooter>
  <header slot="header">
    <Header data={header} />
  </header>
  <main slot="main">
    <div class="-m-4">
      <img
        src="https://thumbs.dreamstime.com/z/two-people-trying-to-jump-start-car-vector-illustration-41549471.jpg" />
    </div>
    <div class="flex items-center justify-center mt-12">
      <p class="py-4 text-sm text-center text-gray-700">
        {address}
        asks you to pay for the required transactions fees to set everything up.<br /><br />
        <b>Do you want to send
          {config
            .getCurrent()
            .web3()
            .utils.fromWei(config.getCurrent().JUMPSTART_MONEY)
            .slice(0, 5)}
          xDai to
          {address}?</b>
      </p>
    </div>
  </main>
  <aside slot="action" />
  <footer slot="footer">
    {#if process}
      <Process
        on:stopped={() => (process = null)}
        {contextInitializer}
        definition={process} />
    {:else}
      <div class="flex w-full h-full p-3 space-x-3 border-t border-gray-300">
        <div
          class="px-10 py-2 text-center uppercase border rounded cursor-pointer text-primary bg-light-100 border-light-400"
          on:click={() => no()}>
          No
        </div>
        <div
          class="w-full py-2 text-center text-white uppercase rounded cursor-pointer bg-primary"
          on:click={() => yes()}>
          Yes
        </div>
      </div>
    {/if}
  </footer>
</TemplateHeaderMainActionFooter>
