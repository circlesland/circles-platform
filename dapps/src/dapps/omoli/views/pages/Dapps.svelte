<script lang="ts">
  import DappIcon from "../../../../libs/o-views/molecules/DappIcon.svelte";
  import {constructAppUrl, dapps} from "../../../../libs/o-os/loader";
  import {OmoSapienState} from "../../../omosapien/manifest";
  import OmosapienAvatar from "../../../../libs/o-views/atoms/OmosapienAvatar.svelte";
  import {onMount} from "svelte";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {FissionAuthState} from "omo-fission/dist/manifest";

  onMount(async () => {

  });

  let availableDapps = dapps.filter(o => !o.isHidden).map(dapp =>
  {
    const appUrls = constructAppUrl(dapp);
    return {
      data: {
        title: dapp.title,
        tag: dapp.tag,
      },
      action: {
        route: "#" + appUrls.appDefaultRoute,
      },
      design: {
        icon: dapp.icon,
        type: dapp.isEnabled ? "" : "disabled",
      }
    }
  });

  let fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let omosapien = tryGetDappState<OmoSapienState>("omo.sapien:1");
</script>

<div class="h-full overflow-hidden">
  <div class="h-full overflow-y-scroll md:overflow-hidden md:flex md:p-4">
    {#if !omosapien || !omosapien.myProfile || !fissionAuth.username}
      <div
        class="p-4 text-xl text-center bg-white border md:w-72 rounded-xl text-primary border-light-200">
        <div class="py-4 text-2xl font-bold uppercase font-title md:text-3xl">
          &nbsp;Welcome Omo
        </div>
      </div>
    {:else}
      <div
        class="p-4 text-xl text-center bg-white border md:w-72 rounded-xl text-primary border-light-200">
        <div>
          <OmosapienAvatar fissionUsername={fissionAuth.username} classes="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300" />
          <!--
          <img
            src={omosapien.myProfile.avatar}
            class="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300"
            alt="img" />-->
        </div>
        <div class="py-4 text-2xl font-bold uppercase font-title md:text-3xl">
          {omosapien.myProfile.firstName}
          {omosapien.myProfile.lastName}
        </div>
      </div>
    {/if}
    <div
      class="grid w-full h-full grid-cols-2 gap-4 p-4 md:overflow-y-scroll md:py-0 md:grid-cols-3 lg:grid-cols-4">
      {#each availableDapps as item}
        <DappIcon mapping={item} />
      {/each}
    </div>
  </div>
</div>
