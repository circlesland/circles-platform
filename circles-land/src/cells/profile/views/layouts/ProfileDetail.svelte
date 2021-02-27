<!-- Avatar on the top, name and other details below -->
<script lang="ts">
  import {Profile} from "omo-central/dist/generated";
  import ProfileField from "../../../../libs/o-views/molecules/ProfileField.svelte";
  import IpfsImage from "../../../../libs/o-views/atoms/IpfsImage.svelte";

  export let profile: Profile;
</script>

{#if profile}
  <div>
    <div
      class="px-4 py-6 text-xl text-center bg-white border md:mt-4 md:py-10 rounded-xl text-primary border-light-200">
      <div>
        <IpfsImage cid={profile.omoAvatarCid} mimeType={profile.omoAvatarMimeType} classes="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300" />
      </div>
    </div>
    <div class="pt-2 space-y-2">
      <ProfileField
        mapping={{ data: { title: profile.firstName, subtitle: 'first name' } }} />
      {#if profile.lastName}
        <ProfileField
          mapping={{ data: { title: profile.lastName, subtitle: 'last name' } }} />
      {/if}
    </div>
  </div>
{:else}
  Loading ..
{/if}
