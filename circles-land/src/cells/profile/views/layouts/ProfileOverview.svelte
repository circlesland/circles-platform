<!-- Avatar and name on the left, activity stream on the right -->
<script lang="ts">
  import {Activity, Profile} from "omo-central/dist/generated";
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";
  import ActivityStream from "../../../activity/views/layouts/ActivityStream.svelte";

  export let profile: Profile;
  export let activities: Activity[] = [];
</script>

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
          {profile.firstName}
          {profile.lastName}
        </div>
      </div>
      <div class="grid w-full h-full grid-cols-2 gap-4 p-4 md:overflow-y-scroll md:py-0 md:grid-cols-3 lg:grid-cols-4">
        <ActivityStream activities={activities} />
      </div>
    {:else}
      Loading ..
    {/if}
  </div>
</div>
