<script lang="ts">
  import {Offer} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import ListItem from "../../../_generic/views/atoms/ListItem.svelte";

  export let offer: Offer;
  const dispatch = createEventDispatcher();
</script>

<ListItem
  imageCid={offer.pictures?.length > 0 ? offer.pictures[0].cid : undefined}
  title={offer.title}
  description="in: {offer.city}, by: {offer.createdBy.omoFirstName} {offer.createdBy.omoLastName}"
  rightText={offer.price}
>
  <span class="text-primary">{offer.description}</span>
</ListItem>