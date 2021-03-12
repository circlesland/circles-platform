<script lang="ts">
  import {PurchasesDocument} from "omo-central/dist/generated";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import PurchaseCard from "../atoms/PurchaseCard.svelte";

  export let client: any;
  export let purchaseId: number = -1;

  setClient(client);
  $:purchases = query(PurchasesDocument, {
    variables: {
      query: {
        "id": purchaseId
      }
    }
  });

</script>
<section class="w-full p-4 mx-auto md:p-8">
  <div class="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#if $purchases.loading}
      Loading purchase...
    {:else if $purchases.error}
      <b>An error occurred while loading the purchase:</b> <br/>{$purchases.error.message}
    {:else if $purchases.data && $purchases.data.purchases && $purchases.data.purchases.length > 0}
      {#each purchases as item(item.name)}
        <PurchaseCard purchase={item}
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