<script lang="ts">
  import { config } from "src/libs/o-circles-protocol/config";
  import { BN } from "ethereumjs-util";

  import { Subscription } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSafeState} from "../../manifest";

  let safeState: OmoSafeState = {};
  let balanceSubscriptions: Subscription;
  let balance: BN = new BN("0");

  const web3 = config.getCurrent().web3();

  function formatBN(bn:BN)
  {
    return parseFloat(web3.utils.fromWei(bn)).toFixed(2);
  }

  function init()
  {
    if (balanceSubscriptions)
    {
      balanceSubscriptions.unsubscribe();
      balanceSubscriptions = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

    if (safeState.myBalances)
    {
      balanceSubscriptions = safeState.myBalances.subscribe(balanceList => {
        const b = balanceList.map(o => parseFloat(o.balance)).reduce((p,c) => p + c, 0).toFixed(2);
        balance = b;
      });
    }
  }

  onDestroy(() => {
    if (!balanceSubscriptions) return;

    balanceSubscriptions.unsubscribe();
    balanceSubscriptions = null;
  });

  onMount(() => init());
</script>

<div
  class="flex items-center justify-center h-full font-bold text-center text-white bg-primary md:rounded-xl">
    <div
      class="flex items-center justify-center pl-6 mx-auto text-6xl uppercase">
      {balance}
      <span><img
          src="symbols/o-white.svg"
          class="h-8 pb-2 pl-2"
          alt="CRC" /></span>
    </div>
</div>
