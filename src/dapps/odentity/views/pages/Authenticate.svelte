<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { onMount } from "svelte";
  import {push} from "svelte-spa-router";
  import {Authenticated} from "../../events/authenticated";

  const wn = window.o.wn;

  export let params;

  let state;

  onMount(async () => {
    await initAuth();
  });

  async function initAuth() {
    state = await wn.initialise({
      permissions: {
        // Will ask the user permission to store
        // your apps data in `private/Apps/{creator}}/{name}`
        app: {
          name: "OmoTest",
          creator: "MamaOmo",
        },
      },
    });

    switch (state.scenario) {
      case wn.Scenario.AuthCancelled:
        break;

      case wn.Scenario.AuthSucceeded:
      case wn.Scenario.Continuation:
        // State:
        // state.authenticated    -  Will always be `true` in these scenarios
        // state.newUser          -  If the user is new to Fission
        // state.throughLobby     -  If the user authenticated through the lobby, or just came back.
        // state.username         -  The user's username.
        //
        // ☞ We can now interact with our file system (more on that later)
        window.o.dispatchShellEvent(new Authenticated(state));
        if (params && params.redirectTo) {
          push(params.redirectTo);
        }  else {
          push("#/odentity/profile");
        }

        break;

      case wn.Scenario.NotAuthorised:
        wn.redirectToLobby(state.permissions);
        break;
    }
  }
</script>

<Compose rows="1fr" columns="1fr" tw="m-4 md:m-0" gap="10px" overflowY>
  <div>
  </div>
</Compose>
