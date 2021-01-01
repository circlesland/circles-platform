<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { onMount } from "svelte";
  import {push} from "svelte-spa-router";
  import { Jumper } from "svelte-loading-spinners";
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
  import {FissionDrive} from "../../../libs/o-fission/fissionDrive";
  import {setDappState} from "../../../libs/o-os/loader";
  import {FissionAuthState} from "../manifest";

  const wn = window.o.wn;

  export let params;

  onMount(async () => {
    await initAuth();
  });

  async function initAuth()
  {
    try
    {
      const state = await wn.initialise({
        permissions: {
          // Will ask the user permission to store
          // your apps data in `private/Apps/{creator}}/{name}`
          app: {
            name: "OmoSapien",
            creator: "MamaOmo",
          },
          fs: {
            publicPaths: ["omo.sapien"],
          },
        },
      });

      switch (state.scenario)
      {
        case wn.Scenario.AuthCancelled:
          break;

        case wn.Scenario.AuthSucceeded:
        case wn.Scenario.Continuation:

          try
          {
            // State:
            // state.authenticated    -  Will always be `true` in these scenarios
            // state.newUser          -  If the user is new to Fission
            // state.throughLobby     -  If the user authenticated through the lobby, or just came back.
            // state.username         -  The user's username.
            //
            // ☞ We can now interact with our file system (more on that later)
            setDappState<FissionAuthState>("omo.fission.auth:1", current =>
            {
              return {
                username: state.username,
                fission: new FissionDrive(state)
              };
            });

            if (params && params.redirectTo)
            {
              window.o.redirectTo = params.redirectTo;
            }

            if (window.o.redirectTo)
            {
              push("#/waiting-area/please-wait");
            }
            else
            {
              push("#/omosapien/profile");
            }
          }
          catch (e)
          {
            console.error("Something went wrong during the authentication process: ", e);
          }
          break;

        case wn.Scenario.NotAuthorised:
          wn.redirectToLobby(state.permissions);
          break;
      }
    }
    catch (e)
    {
      console.error("Something went wrong during the authentication process: ", e);
    }
  }
</script>

<div class="flex items-center justify-center">
  <div>
    <Jumper size="150" color="#071D69" unit="px" /><br />
    <div class="text-sm text-center text-primary foont-primary">
      authenticating ...
    </div>
  </div>
</div>
