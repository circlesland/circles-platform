<script lang="ts">
  import DappIcon from "../../../../libs/o-views/molecules/DappIcon.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { dapps } from "src/dapps/omoli/data/dapps";

  let _dapps = [];
  async function loadDapps() {
    _dapps = await dapps();
  }
  loadDapps();
</script>

<Compose areas="'main'" rows="1fr">
  <Compose
    area="main"
    columns="repeat(auto-fit, minmax(160px, 1fr))"
    rows="repeat({_dapps.length / 2}, 160px)"
    tw="mx-4 mt-4 md:mx-0"
    gap="1rem"
    overflowY>
    {#each _dapps as item}
      <Compose columns="1fr" rows="1fr">
        <DappIcon mapping={item} />
      </Compose>
    {/each}
  </Compose>
</Compose>
