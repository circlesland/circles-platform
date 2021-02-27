<script lang="ts">
  import {Activity, Contact} from "omo-central/dist/generated";
  import {createEventDispatcher} from "svelte";
  import ListItem from "../../../_generic/views/atoms/ListItem.svelte";

  export let activity: Activity;
  const dispatch = createEventDispatcher();
</script>

<ListItem
  title="{activity.objectType} {activity.objectKey}"
  description="{activity.timestamp}: {activity.predicate}"
/>
