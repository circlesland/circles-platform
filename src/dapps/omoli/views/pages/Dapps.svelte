<script lang="ts">
  import DappIcon from "../../../../libs/o-views/molecules/DappIcon.svelte";
  import { dapps } from "src/dapps/omoli/data/dapps";
  import { onMount } from "svelte";
  import { getEnvironment } from "src/libs/o-os/o";
  import { Profile } from "../../../../libs/o-fission/entities/profile";

  let profile: Profile;

  let _dapps = [];
  async function loadDapps() {
    _dapps = await dapps();
  }
  loadDapps();

  async function init() {
    const environment = await getEnvironment();
    profile = environment.me.myProfile;
  }

  onMount(async () => {
    await init();
  });
</script>

<div class="h-full overflow-hidden">
  <div class="h-full overflow-y-scroll md:overflow-hidden md:flex md:p-4">
    {#if profile}
      <div
        class="p-4 text-xl text-center bg-white border md:w-72 rounded-xl text-primary border-light-200">
        <div>
          <img
            src={profile.avatar}
            class="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300"
            alt="img" />
        </div>
        <div class="py-4 text-2xl font-bold uppercase font-title md:text-3xl">
          {profile.firstName}
          {profile.lastName}
        </div>
      </div>
    {/if}
    <div
      class="grid w-full h-full grid-cols-2 gap-4 p-4 md:overflow-y-scroll md:py-0 md:grid-cols-3 lg:grid-cols-4">
      {#each _dapps as item}
        <DappIcon mapping={item} />
      {/each}
    </div>
  </div>
</div>
