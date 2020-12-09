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
  <Compose columns="1fr" rows="140px 1fr">
    <Compose
      rows="1fr"
      columns="1fr"
      tw="md:mt-4 px-6 py-10 flex justify-center items-center bg-white border border-light-200 rounded-xl text-center text-primary font-primary text-2xl">
      Welcome,
      {#if profile}{profile.firstName}{/if}
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
