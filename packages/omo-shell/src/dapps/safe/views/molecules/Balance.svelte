<script lang="ts">
  import { BN } from "ethereumjs-util";

  import { onDestroy, onMount } from "svelte";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSafeState} from "../../manifest";
  import {config} from "omo-circles/dist/config";
  import {OmoEvent} from "omo-events/dist/omoEvent";
  import {ProgressSignal} from "omo-events/dist/signals/progressSignal";
  import {OmoSubscription} from "omo-quirks/dist/OmoSubscription";

  let safeState: OmoSafeState = {};
  let balanceSubscriptions: OmoSubscription;
  let balance: BN = new BN("0");

  const web3 = config.getCurrent().web3();

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
        balance = balanceList.payload.map(o => o.balance).reduce((p, c) => p.add(c), new BN("0"));
      });
    }

    subscription = window.o.events.subscribe((event: OmoEvent) =>
    {
      if (event.type === "shell.begin")
      {
      }
      if (event.type === "shell.done")
      {
        progressIndicator = null;
      }
      if (event.type === "shell.progress")
      {
        const progressEvent: ProgressSignal = <ProgressSignal>event;
        progressIndicator = {
          message: progressEvent.message,
          percent: progressEvent.percent
        }
      }
    });
  }

  onDestroy(() => {
    if (subscription)
      subscription.unsubscribe();
    if (!balanceSubscriptions) return;

    balanceSubscriptions.unsubscribe();
    balanceSubscriptions = null;
  });

  onMount(() => init());

  let progressIndicator: { message: string, percent: number };
  let subscription: Subscription;

</script>

<div
  class="flex items-center justify-center h-full font-bold text-center text-white bg-primary md:rounded-xl">
    <div
      class="flex items-center justify-center pl-6 mx-auto text-6xl uppercase">
      {parseFloat(web3.utils.fromWei(balance.mul(new BN(3)))).toFixed(2)}
      <span><img
          src="symbols/o-white.svg"
          class="h-8 pb-2 pl-2"
          alt="CRC" /></span>
    </div>
</div>
{#if progressIndicator}
  <div class="text-sm text-center text-primary font-primary">
    {progressIndicator.message} ({progressIndicator.percent} %)
  </div>
{/if}
