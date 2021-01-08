<script lang="ts">
  import {Jumper} from "svelte-loading-spinners";
  import {Subscription} from "rxjs";
  import {onDestroy, onMount} from "svelte";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSafeState} from "../../manifest";
  import {CirclesTransaction} from "../../../../libs/o-circles-protocol/model/circlesTransaction";
  import {Signal} from "../../../../libs/o-circles-protocol/interfaces/blockchainEvent";
  import Transactionitem from "../atoms/Transactionitem.svelte";

  let safeState: OmoSafeState = {};
  let transactionsSubscription: Subscription;
  let transactions: CirclesTransaction[] = [];
  let signal: Signal;

  function init()
  {
    if (transactionsSubscription)
    {
      transactionsSubscription.unsubscribe();
      transactionsSubscription = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    if (safeState.myTransactions)
    {
      transactionsSubscription = safeState.myTransactions.subscribe(
        (transactionList) =>
        {
          signal = transactionList.signal;
          transactions = transactionList.payload;
        }
      );
    }
  }

  onDestroy(() =>
  {
    if (!transactionsSubscription) return;

    transactionsSubscription.unsubscribe();
    transactionsSubscription = null;
  });

  onMount(() => init());

  const labelTransactions = {
    data: {
      label: "Your Safe Transactions",
    },
  };
</script>

<div>
  {#if transactions}
    <div>
      {#each transactions as transaction}
        <Transactionitem transaction={transaction}></Transactionitem>
      {/each}
    </div>
  {:else}
    <div class="flex items-center justify-center h-full mx-auto">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {/if}
</div>
