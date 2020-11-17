<script lang="ts">
  import { Address } from "../../o-circles-protocol/interfaces/address";
  import {
    transferCircles,
    TransferCirclesContext,
  } from "../../../dapps/wallet/processes/transferCircles/transferCircles";
  import {
    setTrust,
    SetTrustContext,
  } from "../../../dapps/wallet/processes/setTrust/setTrust";

  export let data = {
    image: "",
    title: "",
    detail: {
      address: "",
      limit: "",
    },
    connection: "",
    actions: [],
  };

  let openDetail: boolean = false;

  function toggleExpand() {
    openDetail = !openDetail;
  }

  function runTransferCircles(recipientAddress: Address) {
    const contextInitializer = (context: TransferCirclesContext) => {
      context.transfer = {
        recipient: {
          type: "ethereumAddress",
          data: recipientAddress,
        },
      };
      return context;
    };
    window.stateMachines.run(transferCircles, contextInitializer);
    window.eventBroker.getTopic("omo", "shell").publish("openMenu");
  }

  function runTrust(recipientAddress: Address) {
    const contextInitializer = (context: SetTrustContext) => {
      context.setTrust = {
        trustReceiver: {
          type: "ethereumAddress",
          data: recipientAddress,
        },
        trustLimit: {
          type: "percent",
          data: 100,
        },
      };
      return context;
    };
    window.stateMachines.run(setTrust, contextInitializer);
    window.eventBroker.getTopic("omo", "shell").publish("openMenu");
  }

  function runUntrust(recipientAddress: Address) {
    const contextInitializer = (context: SetTrustContext) => {
      context.setTrust = {
        trustReceiver: {
          type: "ethereumAddress",
          data: recipientAddress,
        },
        trustLimit: {
          type: "percent",
          data: 0,
        },
      };
      return context;
    };
    window.stateMachines.run(setTrust, contextInitializer);
    window.eventBroker.getTopic("omo", "shell").publish("openMenu");
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<div>
  <div class="w-full bg-white border rounded card border-light-200">
    <div on:click={toggleExpand} class="flex items-center justify-center p-2">
      <img src={data.image} alt="CRC" />
    </div>
    <div class="p-2" on:click={toggleExpand}>
      <div class="text-lg text-primary">{data.title}</div>
      <p class="-mt-1 text-xs text-gray-500">
        {#if data.connection == 'trustBOTH'}
          <i class="fas fa-exchange-alt" /><span class="ml-2">
            mututal trust</span>
        {:else if data.connection == 'trustIN'}
          <i class="fas fa-arrow-left" /><span class="ml-2"> trusting you</span>
        {:else if data.connection == 'trustOUT'}
          <i class="fas fa-arrow-right" /><span class="ml-2">
            trusted by you</span>
        {:else if data.connection == 'trustREVOKED'}
          <i class="fas fa-minus-circle" /><span class="ml-2">
            revoked trust</span>
        {/if}
      </p>
    </div>
    <div class="flex justify-end p-2 space-x-2 text-right">
      {#each data.actions as a}
        {#if a == 'send'}
          <div
            on:click={() => runTransferCircles(data.detail.address)}
            class="flex items-center content-end justify-center w-10 p-3 text-gray-500 bg-gray-300 border-l border-gray-300 rounded hover:bg-primary hover:text-white">
            <i class="fas fa-money-bill-wave" />
          </div>
        {:else if a == 'send' && data.connection == 'trustBOTH'}
          <div
            on:click={() => runTransferCircles(data.detail.address)}
            class="flex items-center content-end justify-center w-10 p-3 text-gray-500 bg-gray-300 border-l border-gray-300 rounded hover:bg-primary hover:text-white">
            <i class="fas fa-money-bill-wave" />
          </div>
        {:else if a == 'trust'}
          <div
            on:click={() => runTrust(data.detail.address)}
            class="flex items-center content-end justify-center w-10 p-3 text-white border-l border-gray-300 rounded bg-secondary hover:bg-primary">
            <i class="fas fa-heart" />
          </div>
        {:else if a == 'untrust'}
          <div
            on:click={() => runUntrust(data.detail.address)}
            class="flex items-center content-end justify-center w-10 p-3 text-gray-500 bg-gray-300 border-l border-gray-300 rounded hover:bg-red-400 hover:text-white">
            <i class="fas fa-minus" />
          </div>
        {/if}
      {/each}
    </div>
  </div>

  {#if data.detail && openDetail}
    <div
      class="w-full p-2 text-xs text-gray-500 bg-white border-b border-l border-r border-light-200">
      <div>
        Address:<span class="pl-2 text-primary">{data.detail.address}</span>
      </div>
      <div>
        Limit:<span class="pl-2 text-primary">{data.detail.limit}%</span>
      </div>
    </div>
  {/if}
</div>

<!-- 
<div class="flex items-center content-end justify-center">
  <div
    class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded ">
    <img src="icons/removeTrust.svg" alt="add" />
  </div>
  <div
    class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded bg-primary">
    <i class="fas fa-money-bill-wave" />
  </div>
</div> -->
