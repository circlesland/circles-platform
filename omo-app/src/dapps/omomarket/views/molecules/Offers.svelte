<script lang="ts">
  import {
    faMailBulk,
    faShoppingCart,
  } from "@fortawesome/free-solid-svg-icons";

  import Icon from "fa-svelte";
  import { featured, offers } from "../../data/offers";
  import {Offer} from "../../../../libs/o-fission/entities/offer";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSapienState} from "../../../omosapien/manifest";
  import {runWithDrive} from "../../../../libs/o-fission/initFission";

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  let myOffers:Offer[] = [];

  async function init() {
    if (omosapienState)
    {
      await runWithDrive(async fissiondrive =>
      {
        myOffers = await fissiondrive.offers.listItems();
      });
    }
  }

  init();

  function mapToListItem(offer:Offer) {
    // const locationParts = offer.productLocation.display_name.split(",");
    // const country = locationParts[locationParts.length - 1];
    const offerItem = {
      data: {
        title: offer.productName,
        image: offer.productPicture,
        description: offer.productDescription,
        price: offer.productPrice,
        state: "active",
        category: "mobility",
        // quantity: "",
        city: offer.productLocation.display_name,
        country:  "" /*country*/,
        delivery: "pickup or delivery",
        offeredBy: {
          image: "",
          firstName: "",
          lastName: "",
          email: ""
        },
      },
    };
    if (omosapienState?.directory)
    {
      const offeredBy = omosapienState.directory.getValue().payload.byFissionName[offer.offeredByFissionName];
      offerItem.data.offeredBy = {
        image: "",
        firstName: offeredBy.firstName,
        lastName: offeredBy.lastName,
        email: ""
      };
    }

    return
  }
</script>

<section class="w-full p-4 mx-auto md:p-8">
  <div class="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
    {#each featured as item}
      <div
        class="flex flex-col overflow-hidden bg-white border hover:shadow-xl rounded-xl border-light-200">
        <div class="relative flex-shrink-0">
          <img
            class="object-cover w-full h-72 md:h-96"
            src={item.data.image}
            alt="img" />
          <span
            class="absolute top-0 right-0 inline-flex items-center px-4 pt-2 pb-1 mt-4 text-2xl font-medium leading-tight text-white rounded-l-full bg-secondary">
            {item.data.price}<img
              src="symbols/o-white.svg"
              alt="o"
              class="w-4 h-4 mb-1 ml-1" />
            {#if item.data.quantity}
              <span
                class="ml-1 text-xs text-blue-200">/{item.data.quantity}</span>
            {/if}</span>
          {#if item.data.state == 'active'}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white bg-action">
              {item.data.state}
            </span>
          {:else if item.data.state == 'pre-order'}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-yellow-700 bg-info">
              {item.data.state}
            </span>
          {:else if item.data.state == 'sold'}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white bg- ">
              {item.data.state}
            </span>
          {/if}
        </div>

        <div class="flex flex-col justify-between flex-1">
          <div class="flex flex-col justify-start flex-1 px-4 pt-4 bg-white">
            <p class="text-lg uppercase text-primary font-title">
              {item.data.title}
            </p>
            <p class="pt-2 pb-4 text-sm text-light-500">
              {item.data.description}
            </p>
          </div>
          <div class="flex items-center p-4 border-t border-light-200">
            <div class="flex-shrink-0">
              <img
                class="w-10 h-10 rounded-xl"
                src={item.data.offeredBy.image}
                alt="" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium leading-5 text-primary">
                <p href="#" class="hover:underline">
                  {item.data.offeredBy.firstName}
                  {item.data.offeredBy.lastName}
                </p>
              </div>
              <div class="text-xs leading-5 text-gray-600">
                {item.data.city},
                {item.data.country}
                {#if item.data.state != 'sold'}| {item.data.delivery}{/if}
              </div>
            </div>
          </div>
          {#if item.data.state != 'sold'}
            <div class="p-4 border-t border-light-200">
              <a
                href="mailto:{item.data.offeredBy.email}?subject=⦿Market Request: {item.data.title}&body=Hi, I am interested in your {item.data.title}..."
                class="flex items-center w-full space-x-4">
                <button
                  class="w-full px-4 py-2 font-semibold bg-transparent border-2 text-secondary border-secondary rounded-xl hover:bg-secondary hover:text-white hover:border-transparent">
                  <Icon icon={faMailBulk} />
                  Contact me
                </button>
                <button
                  class="px-4 py-2 font-semibold text-white border-2 bg-cation bg-action border-action rounded-xl hover:bg-white hover:text-action hover:border-action">
                  <Icon icon={faShoppingCart} />
                </button>
              </a>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#each myOffers.map(o => mapToListItem(o)).concat(offers) as item}
      <div
        class="flex flex-col overflow-hidden bg-white border hover:shadow-xl rounded-xl border-light-200">
        <div class="relative flex-shrink-0">
          <img
            class="object-cover w-full h-72"
            src={item.data.image}
            alt="img" />
          <span
            class="absolute top-0 right-0 inline-flex items-center px-4 pt-2 pb-1 mt-4 text-2xl font-medium leading-tight text-white rounded-l-full bg-secondary">
            {item.data.price}<img
              src="symbols/o-white.svg"
              alt="o"
              class="w-4 h-4 mb-1 ml-1" />
            {#if item.data.quantity}
              <span
                class="ml-1 text-xs text-blue-200">/{item.data.quantity}</span>
            {/if}</span>
          {#if item.data.state == 'active'}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white bg-action">
              {item.data.state}
            </span>
          {:else if item.data.state == 'pre-order'}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-yellow-700 bg-info">
              {item.data.state}
            </span>
          {:else if item.data.state == 'sold'}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white bg-red-400">
              {item.data.state}
            </span>
          {/if}
        </div>

        <div class="flex flex-col justify-between flex-1">
          <div class="flex flex-col justify-start flex-1 px-4 pt-4 bg-white">
            <p class="text-lg uppercase text-primary font-title">
              {item.data.title}
            </p>
            <p class="pt-2 pb-4 text-sm text-light-500">
              {item.data.description}
            </p>
          </div>
          <div class="flex items-center p-4 border-t border-light-200">
            <div class="flex-shrink-0">
              <img
                class="w-10 h-10 rounded-xl"
                src={item.data.offeredBy.image}
                alt="" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium leading-5 text-primary">
                <p href="#" class="hover:underline">
                  {item.data.offeredBy.firstName}
                  {item.data.offeredBy.lastName}
                </p>
              </div>
              <div class="text-xs leading-5 text-gray-600">
                {item.data.city},
                {item.data.country}
                {#if item.data.state != 'sold'}| {item.data.delivery}{/if}
              </div>
            </div>
          </div>
          {#if item.data.state != 'sold'}
            <div class="p-4 border-t border-light-200">
              <a
                href="mailto:{item.data.offeredBy.email}?subject=⦿Market Request: {item.data.title}&body=Hi, I am interested in your {item.data.title}..."
                class="flex items-center w-full space-x-4">
                <button
                  class="w-full px-4 py-2 font-semibold bg-transparent border-2 text-secondary border-secondary rounded-xl hover:bg-secondary hover:text-white hover:border-transparent">
                  <Icon icon={faMailBulk} />
                  Contact me
                </button>
                <button
                  class="px-4 py-2 font-semibold text-white border-2 bg-cation bg-action border-action rounded-xl hover:bg-white hover:text-action hover:border-action">
                  <Icon icon={faShoppingCart} />
                </button>
              </a>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
