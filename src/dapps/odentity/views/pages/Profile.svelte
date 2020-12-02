<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { onMount } from "svelte";
  import ProfileItem from "src/libs/o-views/molecules/ProfileItem.svelte";
  import { GotProfile } from "../../events/gotProfile";
  import { RunProcess } from "../../../../libs/o-events/runProcess";
  import { createOdentity } from "../../processes/createOdentity/createOdentity";
  import { push } from "svelte-spa-router";
  import { OmoEvent } from "../../../../libs/o-events/omoEvent";
  import {connectSafe} from "../../../safe/processes/connectSafe/connectSafe";
  import {Profile} from "../../../../libs/o-fission/entities/profile";
  import {getEnvironment} from "../../../../libs/o-os/o";
  import {BN} from "ethereumjs-util";

  const wn = window.o.wn;

  let profile: Profile;

  window.o.events.subscribe((event: OmoEvent) => {
    if (event.type === "shell.gotProfile") {
      profile = (<GotProfile>event).profile;
    }
  });

  onMount(async () => {
    if (!window.o.fission) {
      push("#/odentity/authenticate");
      return;
    }

    const environment = await getEnvironment();
    profile = environment.me.myProfile;

    console.log("profile", profile);

    if (profile)
    {
      if (!profile.circlesAddress
        || !environment.me.myKey
        || !environment.me.mySafe
        || !environment.me.myToken
        || environment.me.myAddressXDaiBalance.lte(new BN("100"))) {
        window.o.publishEvent(new RunProcess(connectSafe));
        return;
      }

      window.o.publishEvent(new GotProfile(profile));
    } else {
      window.o.publishEvent(new RunProcess(createOdentity));
    }
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
              class="w-32 h-32 mx-auto my-4 bg-white border-4 rounded-full border-light-300"
              alt="img" />
          </div>
          Welcome,
          {profile.firstName}
          {profile.lastName}
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
