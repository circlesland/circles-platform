<script lang="ts">
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import ProfileDetail from "../../../../cells/profile/views/layouts/ProfileDetail.svelte";
  import ProfileList from "../../../../cells/profile/views/layouts/ProfileList.svelte";
  import ProfileOverview from "../../../../cells/profile/views/layouts/ProfileOverview.svelte";

  let fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  console.log("Profile:", fissionAuth)
</script>
<ProfileDetail fissionName={fissionAuth.state.username} client={o.graphQLClient}/>
<ProfileList client={o.graphQLClient} />
<ProfileOverview fissionName={fissionAuth.state.username} client={o.graphQLClient} />