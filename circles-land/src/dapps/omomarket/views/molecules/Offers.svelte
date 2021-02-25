<script lang="ts">
  import {
    faMailBulk,
    faShoppingCart,
  } from "@fortawesome/free-solid-svg-icons";

  import {RunProcess} from "omo-process/dist/events/runProcess";
  import Icon from "fa-svelte";
  import {OmoSapienState} from "../../../omosapien/manifest";
  import {sendMessage, SendMessageContext} from "../../../omotalk/processes/sendMessage";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Offer} from "omo-central-client/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import {checkout, CheckoutContext} from "../../processes/checkout";
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";

  const allOffers = [];

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let myOffers: Offer[] = [];

  async function init() {
    fissionAuth.fissionState.omoCentralClientSubject.subscribe(async api => {
      const result = await api.queryRecentOffers();
      if (result.errors) {
        console.error(result.errors);
        throw new Error("The API returned an error")
      }
      myOffers = result.data.offers;
    });
  }

  init();


  function contact(item) {
    const event = new RunProcess<SendMessageContext>(sendMessage, async ctx => {
      return new Promise((resolve => {
        const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
        fissionAuthState.fissionState.omoCentralClientSubject.subscribe(async api => {
          ctx.omoCentral = api;
          ctx.namespace = "omo.talk"
          ctx.topic = "chat";
          ctx.data.recipient = {
            key: "recipient",
            isValid: true,
            value: item.createdBy.circlesAddress,
            type: "string"
          };
          resolve(ctx);
        });
      }));
    });
    (<any>window).o.publishEvent(event);
  }

  function buy(item) {
    console.log("buy() clicked")
    const event = new RunProcess<CheckoutContext>(checkout, async (ctx: CheckoutContext) => {
      ctx.offer = item;
      return ctx;
    });
    (<any>window).o.publishEvent(event);
  }

  function getPicture(item) {
    return item.pictures?.length > 0 ? ('https://ipfs.io/ipfs/' + item.pictures[0].cid) : "";
  }
</script>

<section class="w-full p-4 mx-auto md:p-8">
  <div class="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
    <!--
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
                src={item.data.createdBy.image}
                alt="" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium leading-5 text-primary">
                <p href="#" class="hover:underline">
                  {item.data.createdBy.firstName}
                  {item.data.createdBy.lastName}
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
                href="mailto:{item.data.createdBy.email}?subject=⦿Market Request: {item.data.title}&body=Hi, I am interested in your {item.data.title}..."
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
    -->
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#each myOffers as item(item.name)}
      <div
        class="flex flex-col overflow-hidden bg-white border hover:shadow-xl rounded-xl border-light-200">
        <div class="relative flex-shrink-0">
          <img
            class="object-cover w-full h-72"
            src={getPicture(item)}
            alt="img" />
          <span
            class="absolute top-0 right-0 inline-flex items-center px-4 pt-2 pb-1 mt-4 text-2xl font-medium leading-tight text-white rounded-l-full bg-secondary">
            {item.price}<img
              src="symbols/o-white.svg"
              alt="o"
              class="w-4 h-4 mb-1 ml-1" />
            {#if item.quantity}
              <span
                class="ml-1 text-xs text-blue-200">/{item.quantity}</span>
            {/if}</span>
          {#if !item.unpublishedAt}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white bg-action">
              available
            </span>
          <!--{:else if item.state == 'pre-order'}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-yellow-700 bg-info">
              {item.state}
            </span>-->
          {:else if item.purchasedAt}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white bg-red-400">
              sold
            </span>
          {:else if item.unpublishedAt}
            <span
              class="absolute top-0 right-0 inline-flex items-center py-2 pl-4 pr-2 pt-2.5 mt-16 text-xs font-black leading-tight rounded-l-full text-white bg-gray-300">
              unavailable
            </span>
          {/if}
        </div>

        <div class="flex flex-col justify-between flex-1">
          <div class="flex flex-col justify-start flex-1 px-4 pt-4 bg-white">
            <p class="text-lg uppercase text-primary font-title">
              {item.title}
            </p>
            <p class="pt-2 pb-4 text-sm text-light-500">
              {item.description}
            </p>
          </div>
          <div class="flex items-center p-4 border-t border-light-200">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl">
              <IpfsImage cid={item.createdBy.omoAvatarCid} mimeType={item.createdBy.omoAvatarMimeType}></IpfsImage>
              <!--<OmosapienAvatar fissionUsername={item.createdBy.fissionUsername}></OmosapienAvatar>-->
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium leading-5 text-primary">
                <p href="#" class="hover:underline">
                  {item.createdBy.omoFirstName}
                  {item.createdBy.omoLastName}
                </p>
              </div>
              <div class="text-xs leading-5 text-gray-600">
                {item.city},
                {item.country}
                {#if !item.unpublishedAt}| {item.delivery}{/if}
              </div>
            </div>
          </div>
          {#if !item.unpublishedAt }
            <div class="p-4 border-t border-light-200">
              <a class="flex items-center w-full space-x-4">
                <button
                  on:click={() => {
                    contact(item);
                  }}
                  class="w-full px-4 py-2 font-semibold bg-transparent border-2 text-secondary border-secondary rounded-xl hover:bg-secondary hover:text-white hover:border-transparent">
                  <Icon icon={faMailBulk} />
                  Contact me
                </button>
                <button
                  on:click={() => {
                    buy(item);
                  }}
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
