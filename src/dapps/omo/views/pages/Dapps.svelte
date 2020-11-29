<script lang="ts">
  import DappIcon from "../../../../libs/o-views/molecules/DappIcon.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { dapps, locked, profile, address } from "src/dapps/omo/data/dapps";
  import ProfileHeader from "src/libs/o-views/molecules/ProfileHeader.svelte";
</script>

<Compose areas="'header''main'" rows="auto 1fr">
  <Compose area="header" tw="">
    <ProfileHeader mapping={profile} />
  </Compose>
    <Compose
      area="main"
      columns="repeat(auto-fit, minmax(160px, 1fr))"
      rows="repeat({dapps.length / 2}, 160px)"
      tw="m-4 md:mx-0"
      gap="1rem"
      overflowY>
      {#each dapps as item}
        <Compose columns="1fr" rows="1fr">
          <DappIcon mapping={item} />
        </Compose>
      {/each}
    </Compose>
</Compose>
