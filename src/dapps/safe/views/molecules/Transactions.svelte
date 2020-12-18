<script lang="ts">
  import dayjs from "dayjs";
  import { Jumper } from "svelte-loading-spinners";
  import {
    faArrowRight,
    faMinus,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";
  import Icon from "fa-svelte";
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import { Subscription } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {CirclesTransaction, Contact, OmoSafeState} from "../../manifest";
  import {BN} from "ethereumjs-util";
  import {config} from "../../../../libs/o-circles-protocol/config";

  let safeState: OmoSafeState = {};
  let transactionsSubscription: Subscription;
  let transactions: CirclesTransaction[] = [];

  const web3 = config.getCurrent().web3();

  function formatBN(bn:BN)
  {
    return parseFloat(web3.utils.fromWei(bn)).toFixed(2);
  }

  function init()
  {
    if (transactionsSubscription)
    {
      transactionsSubscription.unsubscribe();
      transactionsSubscription = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

    if (safeState.myContacts)
    {
      transactionsSubscription = safeState.myTransactions.subscribe(transactionList => {
        transactionList.sort((a, b) => a.blockNo > b.blockNo ? -1 : a.blockNo < b.blockNo ? 1 : 0);
        transactions = transactionList;
      });
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

<div class="h-full">
  <div class="mb-2">
    <CategoryTitle mapping={labelTransactions} />
  </div>
  {#if transactions}
    <div class="space-y-2">
      {#each transactions as t}
        <div>
          <div
            class="flex items-center w-full bg-white border rounded-xl border-light-200"
            on:click={() => (t.openDetail = !t.openDetail)}>
            <div
              class="flex items-center justify-center w-10 text-sm text-light-400 ">
              {#if !t.openDetail}
                <Icon icon={faPlus} />
              {:else if t.openDetail}
                <Icon icon={faMinus} />
              {/if}
            </div>
            <div
              class="flex items-center flex-1 w-2/3 pb-1 pr-2 md:pb-2 md:pt-1">
              <div>
                <b class="text-xs md:text-sm text-primary">
                  {#if t.from !== '0x0000000000000000000000000000000000000000'}
                    {t.direction === 'in' ? 'Incoming' : 'Outgoing'}
                    {t.subject}
                  {:else}Harvested Time{/if}
                </b>
                <p class="text-gray-500 text-xxs md:text-xs">
                  {dayjs(t.timestamp).fromNow()}
                  {#if t.direction === 'in'}
                    {#if t.from !== '0x0000000000000000000000000000000000000000'}
                      from
                      <!-- <a href="#/safe/{t.from}/safe">-->
                      {t.from.slice(0, 12)}...

                      <!-- </a> -->
                    {:else}from MamaOmo{/if}
                  {:else}
                    to
                    <!-- <a href="#/safe/{t.to}/safe"> -->
                    {t.to.slice(0, 12)}...

                    <!-- </a> -->
                  {/if}
                </p>
              </div>
            </div>
            <div class="flex items-center pt-1">
              {#if t.direction === 'out'}
                <div
                  class="w-1/3 px-3 text-2xl font-light text-right md:text-3xl text-primary">
                  <span>-{formatBN(t.amount)}</span>
                </div>
              {:else}
                <div
                  class="w-1/3 px-3 text-2xl font-light text-right md:text-3xl text-action">
                  {formatBN(t.amount)}
                </div>
              {/if}
            </div>
          </div>
          {#if t.openDetail}
            <div
              class="flex max-w-full p-4 mx-4 text-gray-500 bg-white text-xxs md:text-sm">
              <div class="max-w-full text-gray-500 ">
                <div class="flex ">
                  {#if t.from === '0x0000000000000000000000000000000000000000'}
                    <img
                      src="symbols/o.svg"
                      alt="profile"
                      class="w-10 h-10 mt-2 mr-1" />
                  {:else}
                    <img
                      src="https://avatars.dicebear.com/api/avataaars/{t.from}.svg"
                      alt="profile"
                      class="h-12" />
                  {/if}
                  <div class="py-4 text-xl">
                    <Icon icon={faArrowRight} />
                  </div>
                  <img
                    src="https://avatars.dicebear.com/api/avataaars/{t.to}.svg"
                    alt="profile"
                    class="h-12" />
                </div>
                <div class="max-w-full text-gray-500 ">
                  Date:
                  <span class=" text-primary">
                    {dayjs(t.timestamp).format('YYYY D. MMM HH:MM')}</span>
                </div>
                <div>Sender: <span class=" text-primary">{t.from}</span></div>
                <div class="max-w-full text-gray-500 ">
                  Receiver:
                  <span class=" text-primary">{t.to}</span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Amount in circles:
                  <span
                    class=" text-primary">{formatBN(t.o.returnValues.value)}
                    CRC</span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Amount in ⦿:
                  <span
                    class=" text-primary">{(formatBN(t.o.returnValues.value) * 3).toFixed(2)}
                    ⦿</span>
                </div>
                <!-- <div
                  class="justify-center my-2 text-xs uppercase text-secondary "
                  on:click={() => (t.openDetailPayload = !t.openDetailPayload)}>
                  Show Payload
                </div>
                {#if t.openDetailPayload}
                  <pre
                    class=" text-xxs">{JSON.stringify(t, null, 2)}
                    </pre>
                {/if} -->
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex items-center justify-center h-full mx-auto">
      <Jumper size="150" color="#071D69" unit="px" />
    </div>
  {/if}
</div>
