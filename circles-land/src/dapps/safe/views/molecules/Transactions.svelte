<script lang="ts">
  import {Jumper} from "svelte-loading-spinners";
  import {onDestroy, onMount} from "svelte";
  import {OmoSafeState} from "../../manifest";
  import TransactionItem from "../atoms/TransactionItem.svelte";
  import {CirclesTransaction} from "omo-models/dist/circles/circlesTransaction";
  import {Signal} from "omo-events/dist/signals/signal";
  import {BeginSignal} from "omo-events/dist/signals/beginSignal";
  import {EndSignal} from "omo-events/dist/signals/endSignal";
  import {ProgressSignal} from "omo-events/dist/signals/progressSignal";
  import {OmoSubscription} from "omo-quirks/dist/OmoSubscription";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import LoadingSpinner from "../../../../libs/o-views/atoms/LoadingSpinner.svelte";

  let safeState: OmoSafeState = {};
  let transactionsSubscription: OmoSubscription;
  let transactions: CirclesTransaction[] = [];
  let signal: Signal;
  let dummyTransaction: CirclesTransaction;

  function init() {
    if (transactionsSubscription) {
      transactionsSubscription.unsubscribe();
      transactionsSubscription = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    if (safeState.myTransactions) {
      transactionsSubscription = safeState.myTransactions.subscribe(
        (transactionList) => {
          signal = transactionList.signal;
          transactions = transactionList.payload;

          if (signal instanceof BeginSignal) {
            /*
            dummyTransaction = <any>{
              subject: "updating ..."
            };
             */
          } else if (signal instanceof ProgressSignal) {
            dummyTransaction = <any>{
              subject: signal.message + " (" + signal.percent + " % complete)" // "updating your transactions (" + signal.percent + " % complete) ...",
            };
          } else if (signal instanceof EndSignal) {
            dummyTransaction = null;
          }
        }
      );
    }
  }

  onDestroy(() => {
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
      {#if dummyTransaction}
        <TransactionItem transaction={dummyTransaction}></TransactionItem>
      {/if}
      {#each transactions as transaction (transaction.id)}
        <TransactionItem transaction={transaction}></TransactionItem>
      {/each}
    </div>
  {:else}
    <div class="flex items-center justify-center h-full mx-auto">
      <LoadingSpinner />
    </div>
  {/if}
</div>
