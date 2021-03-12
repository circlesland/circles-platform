<script lang="ts">
  import {Offer, OffersDocument} from "omo-central/dist/generated";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import OfferListItem from "../atoms/OfferListItem.svelte";
  import OfferCard from "../../../../dapps/omomarket/views/atoms/OfferCard.svelte";
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {sendMessage, SendMessageContext} from "../../../../dapps/omotalk/processes/sendMessage";
  import {OmoCentral} from "omo-central/dist/omoCentral";
  import {checkout as checkoutProcess, CheckoutContext} from "../../../../dapps/omomarket/processes/checkout";

  export let client: any;
  export let view: "cards" | "list" | undefined;

  setClient(client);
  $:offers = query(OffersDocument, {
    variables: {
      query: {
        "publishedAt_gt": "2010-01-01T00:00:00"
      }
    }
  });

  function contact(item:Offer) {
    const event = new RunProcess<SendMessageContext>(sendMessage, async ctx => {
      const api = await OmoCentral.instance.subscribeToResult();
      ctx.omoCentral = api;
      ctx.namespace = "omo.talk"
      ctx.topic = "chat";
      ctx.data.recipient = {
        key: "recipient",
        isValid: true,
        value: item.createdBy.circlesAddress,
        type: "string"
      };
      return ctx;
    });
    (<any>window).o.publishEvent(event);
  }

  function checkout(item:Offer) {
    const event = new RunProcess<CheckoutContext>(checkoutProcess, async (ctx: CheckoutContext) => {
      ctx.offer = item;
      return ctx;
    });
    (<any>window).o.publishEvent(event);
  }

</script>
{#if !view || view === "list"}
  {#if $offers.loading}
    Loading offers...
  {:else if $offers.error}
    <b>An error occurred while loading the offers:</b> <br/>{$offers.error.message}
  {:else if $offers.data && $offers.data.offers && $offers.data.offers.length > 0}
    {#each $offers.data.offers as offer}
      <OfferListItem
        offer={offer}
        on:contact={() => contact(offer)}
        on:checkout={() => checkout(offer)} />
    {/each}
  {:else}
    <span>No offers</span>
  {/if}
{:else}
  <section class="w-full p-4 mx-auto md:p-8">
    {#if $offers.loading}
      Loading offers...
    {:else if $offers.error}
      <b>An error occurred while loading the offers:</b> <br/>{$offers.error.message}
    {:else if $offers.data && $offers.data.offers && $offers.data.offers.length > 0}
      {#each $offers.data.offers as offer}
        <OfferCard
          offer={offer}
          on:contact={() => contact(offer)}
          on:checkout={() => checkout(offer)} />
      {/each}
    {:else}
      <span>No offers</span>
    {/if}
  </section>
{/if}

