<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import ListItem from "../../../_generic/views/atoms/ListItem.svelte";
  import {CirclesTokenTransfer} from "omo-central-interfaces/dist/types";
  import {Profile} from "omo-central/dist/generated";

  export let circlesTransfer: CirclesTokenTransfer;
  const dispatch = createEventDispatcher();
</script>

<ListItem
  imageCid={circlesTransfer.subject..omoAvatarCid ? circlesTransfer.contactProfile.omoAvatarCid : undefined}
  title="{circlesTransfer.contactProfile.omoFirstName} {circlesTransfer.contactProfile.omoLastName}"
  description="" {circlesTransfer.contactProfile.fissionName}
>
  <span class="text-primary">Known since: {circlesTransfer.createdAt}</span>
</ListItem>