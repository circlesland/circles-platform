<script lang="ts">
  import {Profile} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import ListItem from "../../../_generic/views/atoms/ListItem.svelte";

  export let profile: Profile;
  const dispatch = createEventDispatcher();
</script>

<ListItem
  imageCid={profile.omoAvatarCid}
  title="{profile.omoFirstName} {profile.omoLastName}"
  description="">
</ListItem>