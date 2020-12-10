<script lang="ts">
  import DappIcon from "../../../../libs/o-views/molecules/DappIcon.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { dapps } from "src/dapps/omoli/data/dapps";
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
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

<Mobile>
  <Compose columns="1fr" rows="auto 1fr">
    <Compose rows="1fr" columns="1fr">
      {#if profile}
        <div
          class="px-4 py-6 text-xl text-center bg-white border md:mt-4 md:py-10 rounded-xl text-primary border-light-200">
          <div>
            <img
              src={profile.avatar}
              class="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300"
              alt="img" />
          </div>
          <div class="py-4 text-2xl font-bold md:text-4xl">
            Welcome,
            {profile.firstName}
          </div>
        </div>
      {/if}
    </Compose>
    <Compose
      columns="repeat(auto-fit, minmax(160px, 1fr))"
      rows="repeat({_dapps.length / 2}, 160px)"
      tw="mx-4 mt-4 md:mx-0"
      gap="1rem"
      overflowY>
      {#each _dapps as item}
        <Compose columns="1fr" rows="1fr">
          <DappIcon mapping={item} />
        </Compose>
      {/each}
    </Compose>
  </Compose>
</Mobile>
