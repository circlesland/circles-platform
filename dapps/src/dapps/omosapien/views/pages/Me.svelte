<script lang="ts">
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import ProfileDetail from "../../../../cells/profile/views/layouts/ProfileDetail.svelte";
  import ProfileList from "../../../../cells/profile/views/layouts/ProfileList.svelte";
  import ProfileOverview from "../../../../cells/profile/views/layouts/ProfileOverview.svelte";

  let fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
</script>
<ProfileDetail fissionName={fissionAuth.username} client={o.graphQLClient}/>
<ProfileList client={o.graphQLClient} />
<ProfileOverview fissionName={fissionAuth.username} client={o.graphQLClient} />