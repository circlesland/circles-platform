<script lang="ts">
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import AccessItem from "src/libs/o-views/molecules/AccessItem.svelte";
  import {
    labelDevices,
    labelDapps,
    accessDapps,
    accessDevices,
  } from "./../../data/access";
</script>

<Compose rows="1fr" columns="1fr" tw="px-4 lg:p-6" overflowY>
  <div>
    <CategoryTitle mapping={labelDevices} />
    <div class="space-y-2">
      {#each accessDevices as item}
        <AccessItem mapping={item} />
      {/each}
    </div>
    <CategoryTitle mapping={labelDapps} />
    <div class="space-y-2">
      {#each accessDapps as item}
        <AccessItem mapping={item} />
      {/each}
    </div>
  </div>
</Compose>
