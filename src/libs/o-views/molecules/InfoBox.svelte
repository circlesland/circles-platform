<script lang="ts">
  let accountAddress: string = localStorage.getItem("omo.address");
  let safeAddress: string = localStorage.getItem("omo.safeAddress");
</script>

<div class="w-full p-4 text-xs text-yellow-800 bg-info">
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
