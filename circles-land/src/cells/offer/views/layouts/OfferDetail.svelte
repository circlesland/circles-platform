<script lang="ts">
  import {Offer} from "omo-central/dist/generated";
  import OfferCard from "../atoms/OfferCard.svelte";

  export let offers: Offer[] = [];
</script>
<section class="w-full p-4 mx-auto md:p-8">
  <div class="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#each offers as item(item.name)}
      <!--<OfferListItem offer={item} />-->
      <OfferCard offer={item}
                 statusBadgeText="sold"
                 statusBadgeColor="bg-action"
                 on:contact={() => contact(item)}
                 on:checkout={() => checkout(item)}
      />
    {/each}
  </div>
</section>