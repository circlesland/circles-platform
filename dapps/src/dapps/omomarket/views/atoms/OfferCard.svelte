<script lang="ts">
  import {Offer} from "omo-central/dist/generated";
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";
  import Icon from "fa-svelte";
  import {faMailBulk} from "@fortawesome/free-solid-svg-icons";
  import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
  import {createEventDispatcher} from "svelte";

  export let offer: Offer;

  export let statusBadgeText: String;
  export let statusBadgeColor: String = "bg-action";

  const dispatch = createEventDispatcher();

  function getPicture() {
    return offer.pictures?.length > 0 ? ('https://ipfs.io/ipfs/' + offer.pictures[0].cid) : "";
  }
</script>

<div
  class="flex flex-col overflow-hidden bg-white border hover:shadow-xl rounded-xl border-light-200">
  {#if offer}
  <div class="relative flex-shrink-0">
    <img
      class="object-cover w-full h-72"
      src={getPicture()}
      alt="img"/>
    <span
      class="absolute top-0 right-0 inline-flex items-center px-4 pt-2 pb-1 mt-4 text-2xl font-medium leading-tight text-white rounded-l-full bg-secondary">
            {offer.price} <img src="symbols/o-white.svg" alt="o" class="w-4 h-4 mb-1 ml-1"/>
      </span>
      {#if statusBadgeText}
        <span
          class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white {statusBadgeColor}">
          {statusBadgeText}
        </span>
      {/if}
  </div>

  <div class="flex flex-col justify-between flex-1">
    <div class="flex flex-col justify-start flex-1 px-4 pt-4 bg-white">
      <p class="text-lg uppercase text-primary font-title">
        {offer.title}
      </p>
      <p class="pt-2 pb-4 text-sm text-light-500">
        {offer.description}
      </p>
    </div>
    <div class="flex items-center p-4 border-t border-light-200">
      <div class="flex-shrink-0 w-10 h-10 rounded-xl">
        <IpfsImage cid={offer.createdBy.omoAvatarCid} mimeType={offer.createdBy.omoAvatarMimeType} />
      </div>
      <div class="ml-3">
        <div class="text-sm font-medium leading-5 text-primary">
          <p href="#" class="hover:underline">
            {offer.createdBy.omoFirstName}
            {offer.createdBy.omoLastName}
          </p>
        </div>
        <div class="text-xs leading-5 text-gray-600">
          {offer.city},
          {offer.country}
          {#if !offer.unlistedAt}| {offer.delivery}{/if}
        </div>
      </div>
    </div>
    {#if !offer.unlistedAt }
      <div class="p-4 border-t border-light-200">
        <a class="flex items-center w-full space-x-4">
          <button
            on:click={() => dispatch("contact")}
            class="w-full px-4 py-2 font-semibold bg-transparent border-2 text-secondary border-secondary rounded-xl hover:bg-secondary hover:text-white hover:border-transparent">
            <Icon icon={faMailBulk}/>
            Contact me
          </button>
          <button
            on:click={() => dispatch("checkout")}
            class="px-4 py-2 font-semibold text-white border-2 bg-cation bg-action border-action rounded-xl hover:bg-white hover:text-action hover:border-action">
            <Icon icon={faShoppingCart}/>
          </button>
        </a>
      </div>
    {/if}
  </div>
  {:else}
    loading ..
  {/if}
</div>