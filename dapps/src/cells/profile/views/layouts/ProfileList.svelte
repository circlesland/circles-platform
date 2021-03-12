<script lang="ts">
  import {ProfilesDocument} from "omo-central/dist/generated";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import ProfileListItem from "../atoms/ProfileListItem.svelte";

  export let client: any;

  setClient(client);
  $:profiles = query(ProfilesDocument, {
    variables: {
      query: {

      }
    }
  });

</script>
<section class="w-full p-4 mx-auto md:p-8">
  <div class="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-2">
  </div>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#if $profiles.loading}
      Loading profiles...
    {:else if $profiles.error}
      <b>An error occurred while loading the profiles:</b> <br/>{$profiles.error.message}
    {:else if $profiles.data && $profiles.data.profiles && $profiles.data.profiles.length > 0}
      {#each $profiles.data.profiles as profile}
        <ProfileListItem profile={profile} />
      {/each}
    {:else}
      <span>No profiles</span>
    {/if}
  </div>
</section>