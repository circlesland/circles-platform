<script lang="ts">
  import dayjs from "dayjs";
  import {
    faArrowRight,
    faMinus,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";
  import Icon from "fa-svelte";
  import {CirclesTransaction} from "../../../../libs/o-circles-protocol/model/circlesTransaction";
  import {BN} from "ethereumjs-util";
  import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
  import {onMount} from "svelte";
  import {Contact} from "../../../../libs/o-circles-protocol/model/contact";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSafeState} from "../../manifest";
  import {config} from "../../../../libs/o-circles-protocol/config";

  export let transaction:CirclesTransaction;

  let safeState: OmoSafeState = {};
  let contacts: { [safeAddress: string]: Contact } = {};
  const web3 = config.getCurrent().web3();

  onMount(() => {
    contacts = {};
    safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    safeState.myContacts.subscribe((contactList) =>
    {
      const newContacts = contactList.payload.filter(
        (contact) => !contacts[contact.safeAddress]
      );
      if (newContacts.length == 0)
      {
        return;
      }

      newContacts.forEach((contact) =>
      {
        contacts[contact.safeAddress] = contact;
      });

      contacts = contacts;
    });
  });

  function formatBN(bn: BN)
  {
    return parseFloat(web3.utils.fromWei(bn)).toFixed(2);
  }

  function formatBN2(bn: BN)
  {
    const digits = parseFloat(web3.utils.fromWei(bn)).toFixed(0).length;
    const bnStr = bn.toString();
    return bnStr.substring(0, digits) + "." + bnStr.substring(digits);
  }

  function getProfile(safeAddress: Address)
  {
    const contact = contacts[safeAddress];
    const profile = {
      title: "",
      image: ""
    }

    if (contact && contact.omoProfile)
    {
      if (contact.omoProfile.avatarCid)
      {
        profile.image = contact.omoProfile.avatarCid;
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
      profile.title = safeAddress ? safeAddress.slice(0, 8) : "";
    }

    if (!profile.image)
    {
      profile.image = "https://avatars.dicebear.com/api/avataaars/" + safeAddress + ".svg"
    }

    return profile;
  }
</script>
<div class="mb-1">
  <div
    class="flex items-center w-full bg-white border rounded-xl border-light-200"
    on:click={() => (transaction.openDetail = !transaction.openDetail)}>
    <div
      class="flex items-center justify-center w-10 text-sm text-light-400 ">
      {#if !transaction.openDetail}
        <Icon icon={faPlus} />
      {:else if transaction.openDetail}
        <Icon icon={faMinus} />
      {/if}
    </div>
    <div
      class="flex items-center flex-1 w-2/3 pb-1 pr-2 md:pb-2 md:pt-1">
      <div>
        <b class="text-xs md:text-sm text-primary">
          {#if transaction.from !== '0x0000000000000000000000000000000000000000'}
            {transaction.direction === 'in' ? 'Incoming' : transaction.direction === 'out' ? 'Outgoing' : ""}
            {transaction.subject}
          {:else if transaction.from}
            Harvested Time
          {/if}
        </b>
        <p class="text-gray-500 text-xxs md:text-xs">
          {#if !transaction.timestamp}
            ...
          {:else}{dayjs(new Date(transaction.timestamp * 1000)).fromNow()}{/if}
          {#if transaction.direction === 'in'}
            {#if transaction.from !== '0x0000000000000000000000000000000000000000'}
              from
              {getProfile(transaction.from).title}
            {:else}
              from MamaOmo
            {/if}
          {:else if transaction.direction === "out"}
            to
            {getProfile(transaction.to).title}
          {/if}
        </p>
      </div>
    </div>
    <div class="flex items-center pt-1">
      {#if transaction.direction === 'out'}
        <div
          class="w-1/3 px-3 text-2xl font-light text-right md:text-3xl text-primary">
          <span>-{formatBN(transaction.amount.mul(new BN(3)))}</span>
        </div>
      {:else if transaction.direction === "in"}
        <div
          class="w-1/3 px-3 text-2xl font-light text-right md:text-3xl text-action">
          {formatBN(transaction.amount.mul(new BN(3)))}
        </div>
      {/if}
    </div>
  </div>
  {#if transaction.openDetail}
    <div
      class="flex max-w-full p-4 mx-4 text-gray-500 bg-white text-xxs md:text-sm">
      <div class="max-w-full text-gray-500 ">
        <div class="flex items-center mb-2">
          <div class="flex items-center justify-center">
            {#if transaction.from === '0x0000000000000000000000000000000000000000'}
              <img
                src="symbols/o.svg"
                alt="profile"
                class="h-12 rounded-xl" />
            {:else if transaction.from}
              <img
                src={getProfile(transaction.from).image}
                alt="profile"
                class="h-12 rounded-xl" />
            {/if}
          </div>

          <div class="flex items-center justify-center px-3 text-xl">
            <Icon icon={faArrowRight} />
          </div>
          <div class="flex items-center justify-center">
            <img
              src={getProfile(transaction.to).image}
              alt="profile"
              class="h-12 rounded-xl" />
          </div>
        </div>
        <div class="max-w-full text-gray-500 ">
          Date:
          <span class=" text-primary">
                    {dayjs(new Date(transaction.timestamp * 1000)).format('YYYY D. MMM HH:MM')}</span>
        </div>
        <div>
          Sender:
          <span class=" text-primary">
                    {getProfile(transaction.from).title}
                  </span>
        </div>
        <div class="max-w-full text-gray-500 ">
          Receiver:
          <span class=" text-primary">
                    {getProfile(transaction.to).title}
                  </span>
        </div>
        <div class="max-w-full text-gray-500 ">
          Amount in circles:
          <span class=" text-primary">{formatBN2(transaction.amount)} CRC</span>
        </div>
        <div class="max-w-full text-gray-500 ">
          Amount in ⦿:
          <span
            class=" text-primary">{formatBN2(transaction.amount.mul(new BN(3)))}
            ⦿</span>
        </div>
      </div>
    </div>
  {/if}
</div>
