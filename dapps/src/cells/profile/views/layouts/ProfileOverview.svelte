<!-- Avatar on the top, name and other details below -->
<script lang="ts">
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";
  import {ProfilesDocument} from "omo-central/dist/generated";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import ActivityStream from "../../../activity/views/layouts/ActivityStream.svelte";

  export let fissionName:string;
  export let client: any;

  setClient(client);
  $:profiles = query(ProfilesDocument, {
    variables: {
      query: {
        "fissionName": fissionName
      }
    }
  });

</script>
{#if $profiles.loading}
  Loading profiles...
{:else if $profiles.error}
  <b>An error occurred while loading the profiles:</b> <br/>{$profiles.error.message}
{:else if $profiles.data && $profiles.data.profiles && $profiles.data.profiles.length > 0}
  {#each $profiles.data.profiles as profile}
    <div class="h-full overflow-hidden">
      <div class="h-full overflow-y-scroll md:overflow-hidden md:flex md:p-4">
        {#if profile}
          <div
            class="p-4 text-xl text-center bg-white border md:w-72 rounded-xl text-primary border-light-200">
            <div>
              <IpfsImage cid={profile.omoAvatarCid} mimeType={profile.omoAvatarMimeType}
                         classes="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300"/>
            </div>
            <div class="py-4 text-2xl font-bold uppercase font-title md:text-3xl">
              {profile.omoFirstName}
              {profile.omoLastName}
            </div>
          </div>
          {#if fissionName}
            <ActivityStream client={client} fissionName={fissionName} />
          {/if}
        {:else}
          Loading ..
        {/if}
      </div>
    </div>
  {/each}
{:else}
  <span>Not found</span>
{/if}
