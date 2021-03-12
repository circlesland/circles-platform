<script lang="ts">
  import {PurchasesDocument} from "omo-central/dist/generated";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import PurchaseListItem from "../atoms/PurchaseListItem.svelte";

  export let client: any;

  setClient(client);
  $:purchases = query(PurchasesDocument, {
    variables: {
      query: {
        purchasedByFissionName: "heinzifranz"
      }
    }
  });

</script>
<section class="w-full p-4 mx-auto md:p-8">
  <div class="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#if $purchases.loading}
      Loading purchases...
    {:else if $purchases.error}
      <b>An error occurred while loading the purchases:</b> <br/>{$purchases.error.message}
    {:else if $purchases.data && $purchases.data.purchases && $purchases.data.purchases.length > 0}
      {#each $purchases.data.purchases as purchase}
        <PurchaseListItem purchase={purchase} />
      {/each}
    {:else}
      <span>No purchases</span>
    {/if}
  </div>
</section>