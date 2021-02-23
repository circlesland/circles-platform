<script lang="ts">
  import {onMount} from "svelte";
  import {push} from "svelte-spa-router";
  import {tryToAuthenticate} from "omo-fission/dist/tryToAuthenticate";
  import {setDappState} from "omo-kernel/dist/kernel";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";
  import {FissionDrive} from "omo-fission/dist/fissionDrive";
  import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
  import LoadingSpinner from "../../../libs/o-views/atoms/LoadingSpinner.svelte";

  export let params;

  onMount(async () => {
    const state = await tryToAuthenticate();

    if (state?.username) {
      // set a marker in the local storage that indicates whether we've already logged-in
      localStorage.setItem("fissionAuth", JSON.stringify({
        username: state.username
      }));

      setDappState<FissionAuthState>("omo.fission.auth:1", current => {
        return {
          username: state.username,
          fissionState: state,
          fission: new OmoBehaviorSubject<StatePropagation<FissionDrive>>({
            signal: undefined,
            payload: state.fission
          })
        };
      });

      if (params && params.redirectTo) {
        window.o.redirectTo = params.redirectTo;
      }

      if (window.o.redirectTo) {
        push("#/waiting-area/please-wait");
      } else {
        push("#/omosapien/profile");
      }
    } else {
      throw new Error("Not authenticated")
    }
  });
</script>

<div class="flex items-center justify-center">
  <div>
    <LoadingSpinner />
    <div class="text-sm text-center text-primary foont-primary">
      authenticating ...
    </div>
  </div>
</div>
