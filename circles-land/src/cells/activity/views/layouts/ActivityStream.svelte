<script lang="ts">
  import {Activity} from "omo-central/dist/generated";
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import ActivityListItem from "../atoms/ActivityListItem.svelte";

  export let activities: Activity[] = [];

  const labelActivities = {
    data: {
      label: "My contacts",
    },
  };
</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={labelActivities} />
  </div>
  <div class="mb-4 space-y-2">
    {#each activities as activity}
      <ActivityListItem activity={activity} />
    {/each}
  </div>
</div>
