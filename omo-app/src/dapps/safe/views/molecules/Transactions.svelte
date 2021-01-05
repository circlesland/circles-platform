<script lang="ts">
  import dayjs from "dayjs";
  import { Jumper } from "svelte-loading-spinners";
  import {
    faArrowRight,
    faMinus,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";
  import Icon from "fa-svelte";
  import { Subscription } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import { tryGetDappState } from "../../../../libs/o-os/loader";
  import {BN} from "ethereumjs-util";
  import { config } from "../../../../libs/o-circles-protocol/config";
  import { OmoSafeState } from "../../manifest";
  import { CirclesTransaction } from "../../../../libs/o-circles-protocol/model/circlesTransaction";
  import { Contact } from "../../../../libs/o-circles-protocol/model/contact";
  import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
  import {OmoSapienState} from "../../../omosapien/manifest";

  let safeState: OmoSafeState = {};
  let transactionsSubscription: Subscription;
  let transactions: CirclesTransaction[] = [];
  let contacts: { [safeAddress: string]: Contact } = {};

  const web3 = config.getCurrent().web3();

  function formatBN(bn: BN) {
    return parseFloat(web3.utils.fromWei(bn)).toFixed(2);
  }

  function formatBN2(bn: BN)
  {
    const digits = parseFloat(web3.utils.fromWei(bn)).toFixed(0).length;
    const bnStr = bn.toString();
    return bnStr.substring(0, digits) + "." + bnStr.substring(digits);
  }

  function getProfile(safeAddress:Address)
  {
    const contact = contacts[safeAddress];
    const profile = {
      title: "",
      image: ""
    }

    if (contact && contact.omoProfile)
    {
      if (contact.omoProfile.avatar)
      {
        profile.image = contact.omoProfile.avatar;
      }
      profile.title = `${contact.omoProfile.profile.firstName} ${contact.omoProfile.profile.lastName}`
    }
    else if (contact && contact.circlesProfile)
    {
      profile.image = contact.circlesProfile?.avatarUrl;
      profile.title = contact.circlesProfile.username;
    }
    else
    {
      profile.title = safeAddress.slice(0, 8);
    }

    if (!profile.image)
    {
      profile.image = "https://avatars.dicebear.com/api/avataaars/" + safeAddress + ".svg"
    }

    return profile;
  }

  function init() {
    if (transactionsSubscription) {
      transactionsSubscription.unsubscribe();
      transactionsSubscription = null;
    }

    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

    contacts = {};
    safeState.myContacts.subscribe((contactList) => {
      const newContacts = contactList.filter(
        (contact) => !contacts[contact.safeAddress]
      );
      if (newContacts.length == 0) {
        return;
      }

      newContacts.forEach((contact) => {
        contacts[contact.safeAddress] = contact;
      });

      contacts = contacts;
    });

    if (safeState.myTransactions) {
      transactionsSubscription = safeState.myTransactions.subscribe(
        (transactionList) => {
          transactions = transactionList;
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
      {#each transactions as t}
        <div class="mb-1">
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
                  {:else}{dayjs(new Date(t.timestamp * 1000)).fromNow()}{/if}
                  {#if t.direction === 'in'}
                    {#if t.from !== '0x0000000000000000000000000000000000000000'}
                      from
                      {getProfile(t.from).title}
                    {:else}
                      from MamaOmo
                    {/if}
                  {:else}
                    to
                    {getProfile(t.to).title}
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
                <div class="flex items-center mb-2">
                  <div class="flex items-center justify-center">
                    {#if t.from === '0x0000000000000000000000000000000000000000'}
                      <img
                        src="symbols/o.svg"
                        alt="profile"
                        class="h-12 rounded-xl" />
                    {:else}
                      <img
                        src={getProfile(t.from).image}
                        alt="profile"
                        class="h-12 rounded-xl" />
                    {/if}
                  </div>

                  <div class="flex items-center justify-center px-3 text-xl">
                    <Icon icon={faArrowRight} />
                  </div>
                  <div class="flex items-center justify-center">
                    <img
                      src={getProfile(t.to).image}
                      alt="profile"
                      class="h-12 rounded-xl" />
                  </div>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Date:
                  <span class=" text-primary">
                    {dayjs(new Date(t.timestamp * 1000)).format('YYYY D. MMM HH:MM')}</span>
                </div>
                <div>
                  Sender:
                  <span class=" text-primary">
                    {getProfile(t.from).title}
                  </span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Receiver:
                  <span class=" text-primary">
                    {getProfile(t.to).title}
                  </span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Amount in circles:
                  <span class=" text-primary">{formatBN2(t.amount)} CRC</span>
                </div>
                <div class="max-w-full text-gray-500 ">
                  Amount in ⦿:
                  <span
                    class=" text-primary">{formatBN2(t.amount.mul(new BN(3)))}
                    ⦿</span>
                </div>
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
