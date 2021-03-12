<script lang="ts">
  import {Contact, Purchase} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import ListItem from "../../../_generic/views/atoms/ListItem.svelte";
  import {offer} from "../../../offer/views/atoms/OfferListItem.svelte";

  export let purchase: Purchase;
  const dispatch = createEventDispatcher();

  function getImageCid() {
    return purchase.purchasedItem.pictures?.length > 0 ? purchase.purchasedItem.pictures[0].cid : undefined;
  }
</script>

<ListItem
  imageCid={getImageCid()}
  title="{purchase.purchasedItem.title}"
  description="{purchase.purchasedItem.createdBy.omoFirstName} {purchase.purchasedItem.createdBy.omoLastName}"
  rightText="{purchase.purchasedItem.price}"
>
  INSERT OFFER CARD HERE
</ListItem>