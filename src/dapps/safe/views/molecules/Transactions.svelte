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
  import {BN} from "ethereumjs-util";
  import {config} from "../../../../libs/o-circles-protocol/config";
  import {OmoSafeState} from "../../manifest";
  import {CirclesTransaction} from "../../../../libs/o-circles-protocol/model/circlesTransaction";
  import {Contact} from "../../../../libs/o-circles-protocol/model/contact";

  let safeState: OmoSafeState = {};
  let transactionsSubscription: Subscription;
  let transactions: CirclesTransaction[] = [];
  let contacts: {[safeAddress:string]:Contact} = {};

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

    contacts = {};
    safeState.myContacts.subscribe(contactList =>
    {
      const newContacts = contactList.filter(contact => !contacts[contact.safeAddress]);
      if (newContacts.length == 0)
      {
        return;
      }

      newContacts.forEach(contact => {
        contacts[contact.safeAddress] = contact;
      });

      contacts = contacts;
    });


    if (safeState.myTransactions)
    {
      transactionsSubscription = safeState.myTransactions.subscribe(transactionList => {
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
                  {#if !t.timestamp}
                    ...
                  {:else}
                    {dayjs(new Date(t.timestamp * 1000)).fromNow()}
                  {/if}
                  {#if t.direction === 'in'}
                    {#if t.from !== '0x0000000000000000000000000000000000000000'}
                      from
                      <!-- <a href="#/safe/{t.from}/safe">-->
                      {#if contacts[t.from] && contacts[t.from].circlesProfile && contacts[t.from].circlesProfile.username}
                        {contacts[t.from].circlesProfile.username}
                      {:else}
                        {t.from.slice(0, 12)}...
                      {/if}

                      <!-- </a> -->
                    {:else}from MamaOmo{/if}
                  {:else}
                    to
                    <!-- <a href="#/safe/{t.to}/safe"> -->
                    {#if contacts[t.to] && contacts[t.to].circlesProfile && contacts[t.to].circlesProfile.username}
                      {contacts[t.to].circlesProfile.username}
                    {:else}
                      {t.to.slice(0, 12)}...
                    {/if}

                    <!-- </a> -->
                  {/if}
                </p>
              </div>
            </div>
            <div class="flex items-center pt-1">
              {#if t.direction === 'out'}
                <div
                  class="w-1/3 px-3 text-2xl font-light text-right md:text-3xl text-primary">
                  <span>-{formatBN(t.amount.mul(new BN(3)))}</span>
                </div>
              {:else}
                <div
                  class="w-1/3 px-3 text-2xl font-light text-right md:text-3xl text-action">
                  {formatBN(t.amount.mul(new BN(3)))}
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
                    {#if contacts[t.from] && contacts[t.from].circlesProfile && contacts[t.from].circlesProfile.avatarUrl}
                      <img
                        src="{contacts[t.from].circlesProfile.avatarUrl}"
                        alt="profile"
                        class="h-12" />
                    {:else}
                      <img
                        src="https://avatars.dicebear.com/api/avataaars/{t.from}.svg"
                        alt="profile"
                        class="h-12" />
                    {/if}
                  {/if}
                  <div class="py-4 text-xl">
                    <Icon icon={faArrowRight} />
                  </div>
                  {#if contacts[t.to] && contacts[t.to].circlesProfile && contacts[t.to].circlesProfile.avatarUrl}
                    <img
                      src="{contacts[t.to].circlesProfile.avatarUrl}"
                      alt="profile"
                      class="h-12" />
                  {:else}
                    <img
                      src="https://avatars.dicebear.com/api/avataaars/{t.to}.svg"
                      alt="profile"
                      class="h-12" />
                  {/if}
                </div>
                <div class="max-w-full text-gray-500 ">
                  Date:
                  <span class=" text-primary">
                    {dayjs(t.timestamp).format('YYYY D. MMM HH:MM')}</span>
                </div>
                <div>Sender: <span class=" text-primary">
                  {#if contacts[t.from] && contacts[t.from].circlesProfile && contacts[t.from].circlesProfile.username}
                    {contacts[t.from].circlesProfile.username}
                  {:else}
                    {t.from}
                  {/if}
                </span></div>
                <div class="max-w-full text-gray-500 ">
                  Receiver:
                  <span class=" text-primary">
                  {#if contacts[t.to] && contacts[t.to].circlesProfile && contacts[t.to].circlesProfile.username}
                    {contacts[t.to].circlesProfile.username}
                  {:else}
                    {t.to}
                  {/if}</span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Amount in circles:
                  <span
                    class=" text-primary">{t.amount.toString()}
                    CRC</span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Amount in ⦿:
                  <span
                    class=" text-primary">{t.amount.mul(new BN(3)).toString()}
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
