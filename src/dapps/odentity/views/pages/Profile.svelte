<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import {onMount} from "svelte";
  import Avataaar from "src/libs/o-views/atoms/Avataaar.svelte";
  import ProfileItem from "src/libs/o-views/molecules/ProfileItem.svelte";
  import {firstname, lastname, city} from "./../../data/profile";
  import {Profile} from "../../interfaces/profile";
  import {GotProfile} from "../../events/gotProfile";
  import {RunProcess} from "../../../../libs/o-events/runProcess";
  import {createOdentity} from "../../processes/createOdentity/createOdentity";
  import {push} from "svelte-spa-router";
  import {OmoEvent} from "../../../../libs/o-events/omoEvent";

  const wn = window.o.wn;

  let profile:Profile;

  window.o.shellEvents.subscribe((event:OmoEvent) => {
    if (event.type === "shell.gotProfile") {
      profile = (<GotProfile>event).profile;
    }
  });

  onMount(async () =>
  {
    if (!window.o.fissionAuth)
    {
      push("#/odentity/authenticate");
      return;
    }

    const session = window.o.fissionAuth;

    if (await session.fs.exists(session.fs.appPath(["odentity", "profile.json"])))
    {
      const profileJson = <string>(await session.fs.cat(session.fs.appPath(["odentity", "profile.json"])));
      const profileObj = JSON.parse(profileJson);
      const profile: Profile = profileObj;

      window.o.dispatchShellEvent(new GotProfile(profile));
    }
    else
    {
      window.o.dispatchShellEvent(new RunProcess(createOdentity));
    }
  });


  let openDetail: boolean = false;

  function toggleExpand()
  {
    openDetail = !openDetail;
  }
</script>

<Compose rows="1fr" columns="1fr" tw="m-4 md:m-0" gap="10px" overflowY>
  {#if profile}
    <div>
      <div class="">
        <div
          class="px-4 py-10 text-xl text-center bg-white border rounded-xl text-primary border-light-200 font-title">
          <div
            class="w-32 h-32 mx-auto my-4 bg-white border-4 rounded-full border-light-300">
            <!--<Avataaar mapping={avataaar}/>-->
            <img src="{profile.avatar}" />
          </div>
          Welcome,
          {profile.firstName} {profile.lastName}
        </div>
      </div>
      <div class="pt-2 space-y-2">
        <ProfileItem mapping={{
          data: {
            title: profile.firstName,
            subtitle: "my first name"
          }
        }}/>
        <ProfileItem mapping={ {
          data: {
            title: profile.lastName,
            subtitle: "my last name"
          }
        }}/>
        <ProfileItem mapping={city}/>
      </div>
    </div>
  {/if}
</Compose>
