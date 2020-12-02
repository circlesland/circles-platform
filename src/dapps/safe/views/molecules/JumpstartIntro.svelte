<script lang="ts">
  import { Jumper } from "svelte-loading-spinners";
  import { onMount } from "svelte";
  import { getEnvironment } from "../../../../libs/o-os/o";
  import { ProcessEnvironment } from "../../../../libs/o-processes/interfaces/processEnvironment";

  let environment: ProcessEnvironment;

  async function init() {
    environment = await getEnvironment();
    reload();
  }

  async function reload() {}

  onMount(() => init());
</script>

<div class="mb-6">
  <p class="py-12 text-lg text-center text-primary">
    <span class="text-3xl">0x123456</span>
    <br />is asking you to empower his/her life
  </p><br />
  <div class="text-xs text-center text-light-500">
    {#if environment != undefined}
      You can use your invite credits to invite and unlock the universal basic
      income account of 0x123412678123z812hee9128h9e12912. You still have
      {Math.floor(parseFloat(environment.eth.web3.utils.fromWei(environment.me.mySafeXDaiBalance, 'ether')) * 10)}
      invite credits ({parseFloat(environment.eth.web3.utils.fromWei(environment.me.mySafeXDaiBalance, 'ether')).toFixed(2)}
      xDai) left.<br />
      To refill your invite credits please send xDai to your safe
      0x12347asdf8ahsdsdfo9h8adsfgadshfdasdföaassf or ask in the
      <a href="https://discord.gg/KgbBdAck8X" class="text-secondary-lighter">omo
        community</a>
      for help. (One invite credit = 0.10 xDai)
    {:else}
      <div class="">
        <Jumper size="60" color="#fff" unit="px" />
      </div>
    {/if}
  </div>
</div>
