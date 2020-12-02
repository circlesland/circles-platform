<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { onMount } from "svelte";
  import ProfileItem from "src/libs/o-views/molecules/ProfileItem.svelte";
  import { GotProfile } from "../../events/gotProfile";
  import { push } from "svelte-spa-router";
  import { OmoEvent } from "../../../../libs/o-events/omoEvent";
  import { Profile } from "../../../../libs/o-fission/entities/profile";
  import { getEnvironment } from "../../../../libs/o-os/o";
  import {Subscription} from "rxjs";
  import {RefreshView} from "../../../../libs/o-events/refreshView";

  const wn = window.o.wn;

  let profile: Profile;

  window.o.events.subscribe((event: OmoEvent) => {
    console.log("PRofile received event:", event);
    if (event.type === "shell.gotProfile") {
      profile = (<GotProfile>event).profile;
    }
    if (event.type === "shell.refreshView" && (<RefreshView>event).view == "omosapien.profile") {
      init();
    }
  });

  async function init() {
    if (!window.o.fission) {
      push("#/omosapien/authenticate");
      return;
    }

    const environment = await getEnvironment();
    profile = environment.me.myProfile;
  }

  onMount(async () => {
    await init();
  });

  let openDetail: boolean = false;

  function toggleExpand() {
    openDetail = !openDetail;
  }
</script>

<Compose rows="1fr" columns="1fr" tw="m-4 md:m-0" gap="10px" overflowY>
  {#if profile}
    <div>
      <div class="">
        <div
          class="px-4 py-10 text-xl text-center bg-white border rounded-xl text-primary border-light-200 font-title">
          <div>
            <!--<Avataaar mapping={avataaar}/>-->
            <img
              src={profile.avatar}
              class="w-40 h-40 mx-auto my-4 bg-white border-4 rounded-3xl border-light-300"
              alt="img" />
          </div>
          Welcome,
          {profile.firstName}
        </div>
      </div>
      <div class="pt-2 space-y-2">
        <ProfileItem
          mapping={{ data: { title: profile.firstName, subtitle: 'first name' } }} />
        <ProfileItem
          mapping={{ data: { title: profile.lastName, subtitle: 'last name' } }} />
        <!--<ProfileItem mapping={city} />-->
      </div>
    </div>
  {/if}
</Compose>
