<script lang="ts">
  import type { Address } from "../../o-circles-protocol/interfaces/address";
  import {
    transferCircles,
    TransferCirclesContext,
  } from "../../../dapps/wallet/processes/transferCircles/transferCircles";
  import {
    setTrust,
    SetTrustContext,
  } from "../../../dapps/wallet/processes/setTrust/setTrust";
  import ButtonIcon from "../atoms/ButtonIcon.svelte";
  import { RunProcess } from "../../o-events/runProcess";

  import Icon from "fa-svelte";
  import {
    faArrowLeft,
    faArrowRight,
    faExchangeAlt,
    faHeart,
    faMinus,
    faMinusCircle,
    faMoneyBill,
  } from "@fortawesome/free-solid-svg-icons";

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
    //window.stateMachines.run(setTrust, contextInitializer);
    window.eventBroker
      .getTopic("omo", "shell")
      .publish(new RunProcess(setTrust, contextInitializer));
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
    window.eventBroker
      .getTopic("omo", "shell")
      .publish(new RunProcess(setTrust, contextInitializer));
    // window.stateMachines.run(setTrust, contextInitializer);
    // window.eventBroker.getTopic("omo", "shell").publish("openMenu");
  }

  const sendMoney = {
    design: {
      icon: faMoneyBill,
      type: "primary",
    },
  };
  const addTrust = {
    design: {
      icon: faHeart,
      type: "primary",
    },
  };
  const removeTrust = {
    design: {
      icon: faMinus,
      type: "light-danger",
    },
  };
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
    overflow: hidden;
  }
</style>

<div>
  <div class="w-full bg-white border rounded card border-light-200">
    <div on:click={toggleExpand} class="flex items-center justify-center p-2">
      <img src={data.image} alt="CRC" />
    </div>
    <div class="p-2" on:click={toggleExpand}>
      <div class="text-base text-primary">{data.title}</div>
      <p class="text-xs text-gray-500 ">
        {#if data.connection == 'trustedMutual'}
          <Icon icon={faExchangeAlt} /><span class="ml-2"> mutual trust</span>
        {:else if data.connection == 'trustingMe'}
          <Icon icon={faArrowRight} /><span class="ml-2"> is trusting you</span>
        {:else if data.connection == 'trustedByMe'}
          <Icon icon={faArrowLeft} /><span class="ml-2"> trusted by you</span>
        {:else if data.connection == 'trustRevoked'}
          <Icon icon={faMinusCircle} /><span class="ml-2"> revoked trust</span>
        {/if}
      </p>
    </div>
    <div class="flex justify-end p-2 space-x-2 overflow-hidden text-right">
      {#each data.actions as a}
        {#if a == 'send'}
          <div on:click={() => runTransferCircles(data.detail.address)}>
            <ButtonIcon mapping={sendMoney} />
          </div>
        {:else if a == 'trust'}
          <div on:click={() => runTrust(data.detail.address)}>
            <ButtonIcon mapping={addTrust} />
          </div>
        {:else if a == 'untrust'}
          <div on:click={() => runUntrust(data.detail.address)}>
            <ButtonIcon mapping={removeTrust} />
          </div>
        {/if}
      {/each}
    </div>
  </div>

  {#if data.detail && openDetail}
    <div
      class="w-full p-2 overflow-hidden text-xs text-gray-500 bg-white border-b border-l border-r border-light-200 ">
      <div>
        Address:<br /><span class=" text-primary">{data.detail.address}</span>
      </div>
      <div>
        Limit:<span class="pl-2 text-primary">{data.detail.limit}%</span>
      </div>
    </div>
  {/if}
</div>
