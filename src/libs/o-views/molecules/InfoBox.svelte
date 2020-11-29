<script lang="ts">
  import { onMount } from "svelte";

  let accountAddress: string;
  let safeAddress: string;

  $: safeAddress = "";

  onMount(async () => {
    accountAddress = (await window.o.safe()).owner;
    safeAddress = (await window.o.safe()).address;
  });
</script>

{#if safeAddress}
  <div class="w-full p-4 text-xs text-yellow-800 bg-info rounded-t-xl">
    <div>
      Please Note: To be able to request UBI or (un)trust someone, please send
      EACH 0.01 xDai to your gnosis safe address and to your safe owner address.
    </div>
    <div>
      SafeOwner Address:
      <br /><span class="text-xs">{accountAddress}</span>
    </div>

    <div>Safe Address: <br /><span class="text-xs">{safeAddress}</span></div>
  </div>
{/if}
