<script lang="ts">
  import DappIcon from "../../../../libs/o-views/molecules/DappIcon.svelte";
  import { onMount } from "svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import { dapps, locked, profile } from "src/dapps/omo/data/dapps";
  import ProfileHeader from "src/libs/o-views/molecules/ProfileHeader.svelte";

  let address: string;
  onMount(() => {
    address = localStorage.getItem("omo.safeAddress");
  });
</script>

<Compose areas="'header''main'" rows="auto 1fr">
  <Compose area="header">
    <ProfileHeader data={profile} {address} />
  </Compose>
  <Compose
    area="main"
    columns="1fr 1fr"
    rows="repeat({dapps.length / 2}, 200px)"
    tw="p-4"
    gap="1rem"
    overflowY>
    {#if !address}
      <a href="#/{locked.action.route}">
        <DappIcon data={locked.data} design={locked.design} />
      </a>
    {:else}
      {#each dapps as item}
        <Compose columns="1fr" rows="1fr">
          <a href="#/{item.action.route}">
            <DappIcon data={item.data} design={item.design} />
          </a>
        </Compose>
      {/each}
    {/if}
  </Compose>
</Compose>
