<script lang="ts">
  import DappIcon from "../../../../libs/o-views/molecules/DappIcon.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { dapps, locked, profile, address } from "src/dapps/omo/data/dapps";
  import ProfileHeader from "src/libs/o-views/molecules/ProfileHeader.svelte";
</script>

<Compose areas="'header''main'" rows="auto 1fr">
  <Compose area="header">
    <ProfileHeader mapping={profile} />
  </Compose>
  <Compose
    area="main"
    columns="1fr 1fr"
    rows="repeat({dapps.length / 2}, 200px)"
    tw="p-4"
    gap="1rem"
    overflowY>
    {#if !address}
      <DappIcon mapping={locked} />
    {:else}
      {#each dapps as item}
        <Compose columns="1fr" rows="1fr">
          <DappIcon mapping={item} />
        </Compose>
      {/each}
    {/if}
  </Compose>
</Compose>
