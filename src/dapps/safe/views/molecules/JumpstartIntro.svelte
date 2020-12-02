<script lang="ts">
  import {Jumper} from "svelte-loading-spinners";
  import {onMount} from "svelte";
  import {getEnvironment} from "../../../../libs/o-os/o";
  import {ProcessEnvironment} from "../../../../libs/o-processes/interfaces/processEnvironment";

  let environment: ProcessEnvironment;

  async function init()
  {
    environment = await getEnvironment();
    reload();
  }

  async function reload()
  {
  }

  onMount(() => init());
</script>

<div
  class="flex items-center justify-center h-full font-bold text-center text-white bg-primary md:rounded-xl">
  {#if environment != undefined}
    <div
      class="flex items-center justify-center pl-6 mx-auto text-6xl uppercase">
      {Math.floor(parseFloat(environment.eth.web3.utils.fromWei(environment.me.mySafeXDaiBalance, "ether")) * 10)}
      <span class="text-2xl">invite credits</span>
    </div>
  {:else}
    <div class="flex items-center justify-center mx-auto">
      <Jumper size="60" color="#fff" unit="px"/>
    </div>
  {/if}
</div>

<div class="h-full">
  <div class="space-y-2">
    <p>
      <b>Help 0x1234 to get started with Omo.</b>
    </p><br/>
    <p>
      Omo uses a distributed computer (the xDai blockchain) to process transactions. <br/>
      To keep the network running, every transaction costs a tiny fee.
    </p>
    <p>
      Use your invite credits to pay for the setup fees of a friend.<br/>
      Click 'Next' to proceed.
    </p>
  </div>
</div>
