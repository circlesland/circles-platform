<script lang="ts">
  import ProfileField from "src/libs/o-views/molecules/ProfileField.svelte";
  import {OmoSapienState} from "../../manifest";
  import OmosapienAvatar from "../../../../libs/o-views/atoms/OmosapienAvatar.svelte";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {FissionAuthState} from "omo-fission/dist/manifest";

  let omosapien = tryGetDappState<OmoSapienState>("omo.sapien:1");
  let fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let openDetail: boolean = false;

  function toggleExpand()
  {
    openDetail = !openDetail;
  }
</script>

{#if omosapien}
  <div>
    <div
      class="px-4 py-6 text-xl text-center bg-white border md:mt-4 md:py-10 rounded-xl text-primary border-light-200">
      <div>
        <OmosapienAvatar fissionUsername={fissionAuth.username} classes="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300" />
        <!--<img
          src={omosapien.myProfile.avatar}
          class="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300"
          alt="img" />-->
      </div>
    </div>
    <div class="pt-2 space-y-2">
      <ProfileField
        mapping={{ data: { title: omosapien.myProfile.firstName, subtitle: 'first name' } }} />
      {#if omosapien.myProfile.lastName}
        <ProfileField
          mapping={{ data: { title: omosapien.myProfile.lastName, subtitle: 'last name' } }} />
      {/if}
      <!--<ProfileItem mapping={city} />-->
    </div>
  </div>
{/if}
