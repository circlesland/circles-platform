<script lang="ts">
  import DappIcon from "../../../../libs/o-views/molecules/DappIcon.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { dapps } from "src/dapps/omoli/data/dapps";
</script>

<Compose areas="'main'" rows="1fr">
  <Compose
    area="main"
    columns="repeat(auto-fit, minmax(160px, 1fr))"
    rows="repeat({dapps.length / 2}, 160px)"
    tw="mx-4 mt-4 md:mx-0"
    gap="1rem"
    overflowY>
    {#each dapps as item}
      <Compose columns="1fr" rows="1fr">
        <DappIcon mapping={item} />
      </Compose>
    {/each}
  </Compose>
</Compose>
