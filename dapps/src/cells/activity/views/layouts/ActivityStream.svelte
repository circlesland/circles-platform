<script lang="ts">
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import ActivityListItem from "../atoms/ActivityListItem.svelte";
  import {ActivitiesDocument} from "omo-central/dist/generated";
  import { query } from "svelte-apollo";
  import {setClient} from "svelte-apollo";

  const labelActivities = {
    data: {
      label: "Recent activity",
    },
  };

  export let client:any;
  export let fissionName:string;

  setClient(client);
  $:activities = query(ActivitiesDocument, {
    variables: {
      query: {
        subjectType: "profile",
        subjectKey: fissionName
      }
    }
  });

</script>
<section class="w-full p-4 mx-auto md:p-8">
  <div>
    <div class="mb-4">
      <CategoryTitle mapping={labelActivities} />
    </div>
    <div class="mb-4 space-y-2">
    </div>
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#if $activities.loading}
      Loading offers...
    {:else if $activities.error}
      <b>An error occurred while loading the recent activities:</b> <br/>{$activities.error.message}
    {:else if $activities.data && $activities.data.activities && $activities.data.activities.length > 0}
        {#each $activities.data.activities as activity}
          <ActivityListItem activity={activity} />
        {/each}
    {:else}
      <span>No recent activities</span>
    {/if}
  </div>
</section>