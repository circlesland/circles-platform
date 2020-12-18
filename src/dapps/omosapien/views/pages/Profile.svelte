<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { onMount } from "svelte";
  import ProfileItem from "src/libs/o-views/molecules/ProfileItem.svelte";
  import { push } from "svelte-spa-router";
  import { OmoEvent } from "../../../../libs/o-events/omoEvent";
  import { Profile } from "../../../../libs/o-fission/entities/profile";
  import { getEnvironment } from "../../../../libs/o-os/o";
  import { RefreshView } from "../../../../libs/o-events/refreshView";
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
  import {tryGetDappState} from "../../../../libs/o-os/loader";
  import {OmoSapienState} from "../../manifest";

  const wn = window.o.wn;

  //let profile: Profile;
  let omosapien = tryGetDappState<OmoSapienState>("omo.sapien:1");

  window.o.events.subscribe((event: OmoEvent) => {
    if (
      event.type === "shell.refreshView" &&
      (<RefreshView>event).view == "omosapien.profile"
    ) {
      init();
    }
  });

  async function init() {
    omosapien = tryGetDappState<OmoSapienState>("omo.sapien:1");
  }

  let openDetail: boolean = false;

  function toggleExpand() {
    openDetail = !openDetail;
  }
</script>

<Mobile>
  <Compose rows="1fr" columns="1fr" tw="m-4 md:m-0" gap="10px" overflowY>
    {#if omosapien}
      <div>
        <div
          class="px-4 py-6 text-xl text-center bg-white border md:mt-4 md:py-10 rounded-xl text-primary border-light-200">
          <div>
            <img
              src={omosapien.myProfile.avatar}
              class="w-40 h-40 mx-auto bg-white border-4 rounded-full md:w-48 md:h-48 border-light-300"
              alt="img" />
          </div>
        </div>
        <div class="pt-2 space-y-2">
          <ProfileItem
            mapping={{ data: { title: omosapien.myProfile.firstName, subtitle: 'first name' } }} />
          {#if omosapien.myProfile.lastName}
            <ProfileItem
              mapping={{ data: { title: omosapien.myProfile.lastName, subtitle: 'last name' } }} />
          {/if}
          <!--<ProfileItem mapping={city} />-->
        </div>
      </div>
    {/if}
  </Compose>
</Mobile>
