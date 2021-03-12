<script lang="ts">
  import {OffersDocument} from "omo-central/dist/generated";
  import OfferCard from "../../../../dapps/omomarket/views/atoms/OfferCard.svelte";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";

  export let client: any;
  export let offerId: number = -1;

  setClient(client);
  $:offers = query(OffersDocument, {
    variables: {
      query: {
        "id": offerId
      }
    }
  });

</script>
<section class="w-full p-4 mx-auto md:p-8">
  <div class="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#if $offers.loading}
      Loading offer...
    {:else if $offers.error}
      <b>An error occurred while loading the offer:</b> <br/>{$offers.error.message}
    {:else if $offers.data && $offers.data.offers && $offers.data.offers.length > 0}
      {#each offers as item(item.name)}
        <OfferCard offer={item}
                   statusBadgeText="sold"
                   statusBadgeColor="bg-action"
                   on:contact={() => contact(item)}
                   on:checkout={() => checkout(item)}
        />
      {/each}
    {:else}
      <span>Not found</span>
    {/if}
  </div>
</section>